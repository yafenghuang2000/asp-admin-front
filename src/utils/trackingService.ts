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

  // static async sendEvents(): Promise<void> {
  //只能发送小数据量，大数据量会被浏览器拦截
  //   this.initialize();
  //   const events = await this.db.events.toArray();
  //   console.log(events, 'events');
  //   if (events.length > 0) {
  //     try {
  //       const success = navigator.sendBeacon(
  //         '/api/user/track-event',
  //         new Blob([JSON.stringify(events)], { type: 'application/json' }),
  //       );
  //       if (success) {
  //         await this.db.events.clear(); // 发送成功后清空数据
  //       } else {
  //         throw new Error('Failed to send tracking data using sendBeacon');
  //       }
  //     } catch (error) {
  //       console.error('Failed to send tracking data:', error);
  //     }
  //   }
  // }

  static async sendEvents(): Promise<void> {
    this.initialize();
    const events = await this.db.events.toArray();
    if (events.length > 0) {
      try {
        const response = await this.fetchWithTimeout('/api/user/track-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(events),
          keepalive: true, // 确保请求在页面卸载后仍能继续发送
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
      void this.sendEvents();
    });
  }
  // 页面加载时检查并上报数据
  static async checkAndSendEventsOnLoad(): Promise<void> {
    this.initialize();
    const events = await this.db.events.toArray();
    if (events.length > 0) {
      await this.sendEvents();
    }
  }
}

// 初始化埋点服务
TrackingService.setupPageUnloadListener();

// 页面加载时检查并上报数据
window.addEventListener('load', async () => {
  try {
    await TrackingService.checkAndSendEventsOnLoad();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('页面加载时检查并上报埋点数据出错:', error);
  }
});

export default TrackingService;

//发送埋点数据
// TrackingService.trackEvent('click', { buttonId: 'submit-button' });
