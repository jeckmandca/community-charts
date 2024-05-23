const tabMap = {
  "0": ["latest"],
  "1": ["dailyanalysis"],
  "2": ["upsidedowndata"]
};

export const channelMap = Object.fromEntries(
  Object.entries(tabMap)
    .map(([tab, channels]) => channels.map((channel) => [channel, tab]))
    .flat()
);

export function channel2tab(channel) {
  return channelMap[channel] || "0";
}

export const defaultChannel = "latest";

export const defaultTab = channel2tab(defaultChannel);

export function tab2channel(tab) {
  return tabMap[tab] ? tabMap[tab][0] : defaultChannel;
}
