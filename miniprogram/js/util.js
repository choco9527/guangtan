export const locMapFn = (poi, i) => {
  let title = poi.title
  let lat = poi.location.lat // 纬度
  let lng = poi.location.lng // 经度
  return {
    id: i,
    latitude: lat,
    longitude: lng,
    alpha: 0.8,
    callout: {
      display: 'ALWAYS',
      padding: 4,
      color: '#333',
      borderWidth: 1,
      bgColor: '#fafafa',
      content: title  // 点击marker展示title
    }
  }
}
