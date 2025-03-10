import { Dexie } from 'dexie';

// 定义埋点数据结构
interface ITrackingEvent {
  id?: number; // 自增 ID
  eventType: string; // 事件类型，如 'click'
  eventData: Record<string, unknown>; // 事件数据
  timestamp: number; // 时间戳
}

// 创建 IndexedDB 数据库
class TrackingDB extends Dexie {
  events!: Dexie.Table<ITrackingEvent, number>;

  constructor() {
    super('TrackingDB');
    this.version(1).stores({
      events: '++id, eventType, timestamp', // 定义表结构
    });
  }
}

// 埋点服务类
class TrackingService {
  private static db: TrackingDB;
  private static readonly MAX_EVENTS = 1000; // 最大埋点数据条数

  // 初始化数据库
  static initialize(): void {
    if (!this.db) {
      this.db = new TrackingDB();
    }
  }

  // 记录事件
  static async trackEvent(eventType: string, eventData: Record<string, unknown>): Promise<void> {
    this.initialize();
    await this.db.events.add({
      eventType,
      eventData,
      timestamp: Date.now(),
    });
    // 检查数据条数，如果超过阈值则上报
    const eventCount = await this.db.events.count();
    if (eventCount >= this.MAX_EVENTS) {
      await this.sendEvents();
    }
  }

  // 发送埋点数据到服务端
  static async sendEvents(): Promise<void> {
    this.initialize();
    const events = await this.db.events.toArray();
    if (events.length > 0) {
      try {
        const response = await this.fetchWithTimeout('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(events),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await this.db.events.clear(); // 发送成功后清空数据
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to send tracking data:', error);
      }
    }
  }

  // 带超时的 fetch 请求
  private static async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 5000,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // 监听页面关闭事件
  static setupPageUnloadListener(): void {
    window.addEventListener('beforeunload', async () => {
      // 在页面关闭时发送埋点数据
      await this.sendEvents();
    });
  }
}

// 初始化埋点服务
TrackingService.setupPageUnloadListener();

export default TrackingService;

// 使用 trackEvent 方法将点击事件存储到 IndexedDB 中，然后在页面关闭时发送到服务端。在页面关闭时，会触发 beforeunload 事件，我们可以在这个事件处理函数中调用 sendEvents 方法发送埋点数据。
// TrackingService.trackEvent('click', { buttonId: 'submit-button' });
