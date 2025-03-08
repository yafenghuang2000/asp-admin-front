import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userinfo',
  initialState: {
    name: 'admin',
  },
  reducers: {
    setUserinfo: (state, actio) => {
      return { ...state, userinfo: actio.payload };
    },
  },
});

export const { setUserinfo } = userSlice.actions;
export default userSlice.reducer;
