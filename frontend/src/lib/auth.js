
export const getAuthToken = () => {
  const token = localStorage.getItem('Token');
  //console.log('从 localStorage 获取的令牌:', token);
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      if (Date.now() > expirationTime) {
		console.log('令牌已过期，清除令牌');
        clearAuthToken();
        return null;
      }
    } catch (error) {
	  console.error('解析令牌时出错:', error);
      console.error('Error parsing token:', error);
      clearAuthToken();
      return null;
    }
  }
  return token;
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('Token', token);
	console.log('令牌已成功存储到 localStorage');
  } catch (error) {
    console.error('存储令牌到 localStorage 失败:', error);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('Token');
};