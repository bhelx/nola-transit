export default {
  // Offset in seconds to skew the clock. Should
  // default to 0 for prodction.
  // Examples:
  //   clockOffset: 60*60*8    // 8 hours into future
  //   clockOffset: -60*60*24  // 1 day into past
  clockOffset: 0,

  // This is the default map region to show
  // (location and bounds) on any given map.
  // It's a function so it can take the window
  // dimensions as an argument.
  defaultMapRegion: (dimensions) => {
    const { width, height } = dimensions;
    const aspect_ratio = width / height;
    const latitude_delta = 0.0222;

    return {
      latitude: 29.9301714,
      longitude: -90.0804212,
      latitudeDelta: latitude_delta,
      longitudeDelta: latitude_delta * aspect_ratio
    };
  },

  // Polling interval for data (in milliseconds) for every screen
  pollingInterval: 10*1000, // 10 seconds
};
