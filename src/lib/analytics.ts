// Google Analytics 4 - 页面访问追踪
// 1. 去 https://analytics.google.com 注册账号
// 2. 创建数据流，获取 Measurement ID（格式 G-XXXXXXXXXX）
// 3. 把下面的 '' 替换为你的 Measurement ID
// 4. 重新构建部署

const GA_MEASUREMENT_ID = ''; // ← 填入你的 G-XXXXXXXXXX

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === '') {
    console.warn('[Analytics] Measurement ID 未设置，跳过追踪');
    return;
  }

  // 加载 gtag 脚本
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // 初始化 dataLayer
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}
