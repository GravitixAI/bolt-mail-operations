// Theme configuration
export interface Theme {
  name: string;
  value: string;
  cssFile: string;
  colors: {
    primary: string;
    accent: string;
    secondary: string;
    muted: string;
  };
}

export const themes: Theme[] = [
  { name: "USAF", value: "usaf", cssFile: "usaf.css", colors: {"primary":"oklch(0.3076 0.0920 251.9772)","accent":"oklch(0.8078 0 0)","secondary":"oklch(0.7348 0 0)","muted":"oklch(0.9392 0.0075 260.7315)"} },
  { name: "USA", value: "usa", cssFile: "usa.css", colors: {"primary":"oklch(0.4230 0.0739 117.1194)","accent":"oklch(0 0 0)","secondary":"oklch(0.6521 0.1322 81.5716)","muted":"oklch(0.9067 0 0)"} },
  { name: "USCG", value: "uscg", cssFile: "uscg.css", colors: {"primary":"oklch(0.5808 0.2383 29.2339)","accent":"oklch(0.7505 0.1791 58.2827)","secondary":"oklch(0.3233 0.1025 253.8852)","muted":"oklch(0.9067 0 0)"} },
  { name: "USMC", value: "usmc", cssFile: "usmc.css", colors: {"primary":"oklch(0.3767 0.1546 29.2339)","accent":"oklch(0.5117 0.2016 20.6200)","secondary":"oklch(0.7665 0.1387 91.0594)","muted":"oklch(0.9067 0 0)"} },
  { name: "USN", value: "usn", cssFile: "usn.css", colors: {"primary":"oklch(0.1857 0.0480 268.6748)","accent":"oklch(0.8393 0.0231 248.1031)","secondary":"oklch(0.7665 0.1387 91.0594)","muted":"oklch(0.9392 0.0075 260.7315)"} },
  { name: "USSF", value: "ussf", cssFile: "ussf.css", colors: {"primary":"oklch(0.4371 0.0347 245.5389)","accent":"oklch(0.7095 0.0211 245.7453)","secondary":"oklch(0.7095 0.0211 245.7453)","muted":"oklch(0.8195 0.0273 257.0377)"} },
  { name: "Coastal Artistry", value: "coastal-artistry", cssFile: "coastal-artistry.css", colors: {"primary":"oklch(0.3987 0.0709 229.8604)","accent":"oklch(0.3392 0.0244 248.5486)","secondary":"oklch(0.3392 0.0244 248.5486)","muted":"oklch(0.6256 0.0294 211.1271)"} },
  { name: "Petra", value: "petra", cssFile: "petra.css", colors: {"primary":"oklch(0.5535 0.1548 29.2160)","accent":"oklch(0.6304 0.1800 259.9560)","secondary":"oklch(0.6304 0.1800 259.9560)","muted":"oklch(0.7621 0.0581 33.4626)"} },
  { name: "Red And Lively", value: "red-and-lively", cssFile: "red-and-lively.css", colors: {"primary":"oklch(0.6541 0.1998 6.6900)","accent":"oklch(0.4541 0.1681 1.4540)","secondary":"oklch(0.4541 0.1681 1.4540)","muted":"oklch(0.8050 0.0628 1.9915)"} },
  { name: "Youthful And Fun", value: "youthful-and-fun", cssFile: "youthful-and-fun.css", colors: {"primary":"oklch(0.8642 0.1763 91.9286)","accent":"oklch(0.8437 0.1436 189.7732)","secondary":"oklch(0.5811 0.1998 315.4418)","muted":"oklch(0.8323 0.1010 47.1495)"} },
  { name: "Default", value: "default", cssFile: "default.css", colors: {"primary":"oklch(0.2050 0 0)","accent":"oklch(0.9700 0 0)","secondary":"oklch(0.9700 0 0)","muted":"oklch(0.9700 0 0)"} },
  { name: "Amber Minimal", value: "amber-minimal", cssFile: "amber-minimal.css", colors: {"primary":"oklch(0.7686 0.1647 70.0804)","accent":"oklch(0.9869 0.0214 95.2774)","secondary":"oklch(0.9670 0.0029 264.5419)","muted":"oklch(0.9846 0.0017 247.8389)"} },
  { name: "Amethyst Haze", value: "amethyst-haze", cssFile: "amethyst-haze.css", colors: {"primary":"oklch(0.6104 0.0767 299.7335)","accent":"oklch(0.7889 0.0802 359.9375)","secondary":"oklch(0.8957 0.0265 300.2416)","muted":"oklch(0.8906 0.0139 299.7754)"} },
  { name: "Bold Tech", value: "bold-tech", cssFile: "bold-tech.css", colors: {"primary":"oklch(0.6056 0.2189 292.7172)","accent":"oklch(0.9319 0.0316 255.5855)","secondary":"oklch(0.9618 0.0202 295.1913)","muted":"oklch(0.9691 0.0161 293.7558)"} },
  { name: "Bubblegum", value: "bubblegum", cssFile: "bubblegum.css", colors: {"primary":"oklch(0.6209 0.1801 348.1385)","accent":"oklch(0.9195 0.0801 87.6670)","secondary":"oklch(0.8095 0.0694 198.1863)","muted":"oklch(0.8800 0.0504 212.0952)"} },
  { name: "Caffeine", value: "caffeine", cssFile: "caffeine.css", colors: {"primary":"oklch(0.4341 0.0392 41.9938)","accent":"oklch(0.9310 0 0)","secondary":"oklch(0.9200 0.0651 74.3695)","muted":"oklch(0.9521 0 0)"} },
  { name: "Candyland", value: "candyland", cssFile: "candyland.css", colors: {"primary":"oklch(0.8677 0.0735 7.0855)","accent":"oklch(0.9680 0.2110 109.7692)","secondary":"oklch(0.8148 0.0819 225.7537)","muted":"oklch(0.8828 0.0285 98.1033)"} },
  { name: "Catppuccin", value: "catppuccin", cssFile: "catppuccin.css", colors: {"primary":"oklch(0.5547 0.2503 297.0156)","accent":"oklch(0.6820 0.1448 235.3822)","secondary":"oklch(0.8575 0.0145 268.4756)","muted":"oklch(0.9060 0.0117 264.5071)"} },
  { name: "Claude", value: "claude", cssFile: "claude.css", colors: {"primary":"oklch(0.6171 0.1375 39.0427)","accent":"oklch(0.9245 0.0138 92.9892)","secondary":"oklch(0.9245 0.0138 92.9892)","muted":"oklch(0.9341 0.0153 90.2390)"} },
  { name: "Claymorphism", value: "claymorphism", cssFile: "claymorphism.css", colors: {"primary":"oklch(0.5854 0.2041 277.1173)","accent":"oklch(0.9376 0.0260 321.9388)","secondary":"oklch(0.8687 0.0043 56.3660)","muted":"oklch(0.9232 0.0026 48.7171)"} },
  { name: "Clean Slate", value: "clean-slate", cssFile: "clean-slate.css", colors: {"primary":"oklch(0.5854 0.2041 277.1173)","accent":"oklch(0.9299 0.0334 272.7879)","secondary":"oklch(0.9276 0.0058 264.5313)","muted":"oklch(0.9670 0.0029 264.5419)"} },
  { name: "Cosmic Night", value: "cosmic-night", cssFile: "cosmic-night.css", colors: {"primary":"oklch(0.5417 0.1790 288.0332)","accent":"oklch(0.9221 0.0373 262.1410)","secondary":"oklch(0.9174 0.0435 292.6901)","muted":"oklch(0.9580 0.0133 286.1454)"} },
  { name: "Cyberpunk", value: "cyberpunk", cssFile: "cyberpunk.css", colors: {"primary":"oklch(0.6726 0.2904 341.4084)","accent":"oklch(0.8903 0.1739 171.2690)","secondary":"oklch(0.9595 0.0200 286.0164)","muted":"oklch(0.9595 0.0200 286.0164)"} },
  { name: "Darkmatter", value: "darkmatter", cssFile: "darkmatter.css", colors: {"primary":"oklch(0.6716 0.1368 48.5130)","accent":"oklch(0.9491 0 0)","secondary":"oklch(0.5360 0.0398 196.0280)","muted":"oklch(0.9670 0.0029 264.5419)"} },
  { name: "Doom 64", value: "doom-64", cssFile: "doom-64.css", colors: {"primary":"oklch(0.5016 0.1887 27.4816)","accent":"oklch(0.5880 0.0993 245.7394)","secondary":"oklch(0.4955 0.0896 126.1858)","muted":"oklch(0.7826 0 0)"} },
  { name: "Elegant Luxury", value: "elegant-luxury", cssFile: "elegant-luxury.css", colors: {"primary":"oklch(0.4650 0.1470 24.9381)","accent":"oklch(0.9619 0.0580 95.6174)","secondary":"oklch(0.9625 0.0385 89.0943)","muted":"oklch(0.9431 0.0068 53.4442)"} },
  { name: "Graphite", value: "graphite", cssFile: "graphite.css", colors: {"primary":"oklch(0.4891 0 0)","accent":"oklch(0.8078 0 0)","secondary":"oklch(0.9067 0 0)","muted":"oklch(0.8853 0 0)"} },
  { name: "Kodama Grove", value: "kodama-grove", cssFile: "kodama-grove.css", colors: {"primary":"oklch(0.6657 0.1050 118.9078)","accent":"oklch(0.8361 0.0713 90.3269)","secondary":"oklch(0.8532 0.0631 91.1493)","muted":"oklch(0.8532 0.0631 91.1493)"} },
  { name: "Midnight Bloom", value: "midnight-bloom", cssFile: "midnight-bloom.css", colors: {"primary":"oklch(0.5676 0.2021 283.0838)","accent":"oklch(0.6475 0.0642 117.4260)","secondary":"oklch(0.8214 0.0720 249.3482)","muted":"oklch(0.8202 0.0213 91.6163)"} },
  { name: "Mocha Mousse", value: "mocha-mousse", cssFile: "mocha-mousse.css", colors: {"primary":"oklch(0.6083 0.0623 44.3588)","accent":"oklch(0.8502 0.0389 49.0874)","secondary":"oklch(0.7473 0.0387 80.5476)","muted":"oklch(0.8502 0.0389 49.0874)"} },
  { name: "Modern Minimal", value: "modern-minimal", cssFile: "modern-minimal.css", colors: {"primary":"oklch(0.6231 0.1880 259.8145)","accent":"oklch(0.9514 0.0250 236.8242)","secondary":"oklch(0.9670 0.0029 264.5419)","muted":"oklch(0.9846 0.0017 247.8389)"} },
  { name: "Mono", value: "mono", cssFile: "mono.css", colors: {"primary":"oklch(0.5555 0 0)","accent":"oklch(0.9702 0 0)","secondary":"oklch(0.9702 0 0)","muted":"oklch(0.9702 0 0)"} },
  { name: "Nature", value: "nature", cssFile: "nature.css", colors: {"primary":"oklch(0.5234 0.1347 144.1672)","accent":"oklch(0.8952 0.0504 146.0366)","secondary":"oklch(0.9571 0.0210 147.6360)","muted":"oklch(0.9370 0.0142 74.4218)"} },
  { name: "Neo Brutalism", value: "neo-brutalism", cssFile: "neo-brutalism.css", colors: {"primary":"oklch(0.6489 0.2370 26.9728)","accent":"oklch(0.5635 0.2408 260.8178)","secondary":"oklch(0.9680 0.2110 109.7692)","muted":"oklch(0.9551 0 0)"} },
  { name: "Northern Lights", value: "northern-lights", cssFile: "northern-lights.css", colors: {"primary":"oklch(0.6487 0.1538 150.3071)","accent":"oklch(0.8269 0.1080 211.9627)","secondary":"oklch(0.6746 0.1414 261.3380)","muted":"oklch(0.8828 0.0285 98.1033)"} },
  { name: "Notebook", value: "notebook", cssFile: "notebook.css", colors: {"primary":"oklch(0.4891 0 0)","accent":"oklch(0.9354 0.0456 94.8549)","secondary":"oklch(0.9006 0 0)","muted":"oklch(0.9158 0 0)"} },
  { name: "Ocean Breeze", value: "ocean-breeze", cssFile: "ocean-breeze.css", colors: {"primary":"oklch(0.4891 0 0)","accent":"oklch(0.9354 0.0456 94.8549)","secondary":"oklch(0.9006 0 0)","muted":"oklch(0.9158 0 0)"} },
  { name: "Pastel Dreams", value: "pastel-dreams", cssFile: "pastel-dreams.css", colors: {"primary":"oklch(0.7090 0.1592 293.5412)","accent":"oklch(0.9376 0.0260 321.9388)","secondary":"oklch(0.9073 0.0530 306.0902)","muted":"oklch(0.9464 0.0327 307.1745)"} },
  { name: "Perpetuity", value: "perpetuity", cssFile: "perpetuity.css", colors: {"primary":"oklch(0.5624 0.0947 203.2755)","accent":"oklch(0.9021 0.0297 201.8915)","secondary":"oklch(0.9244 0.0181 196.8450)","muted":"oklch(0.9295 0.0107 196.9723)"} },
  { name: "Quantum Rose", value: "quantum-rose", cssFile: "quantum-rose.css", colors: {"primary":"oklch(0.6002 0.2414 0.1348)","accent":"oklch(0.8766 0.0828 344.8849)","secondary":"oklch(0.9230 0.0701 326.1273)","muted":"oklch(0.9429 0.0363 344.2604)"} },
  { name: "Retro Arcade", value: "retro-arcade", cssFile: "retro-arcade.css", colors: {"primary":"oklch(0.5924 0.2025 355.8943)","accent":"oklch(0.5808 0.1732 39.5003)","secondary":"oklch(0.6437 0.1019 187.3840)","muted":"oklch(0.6979 0.0159 196.7940)"} },
  { name: "Soft Pop", value: "soft-pop", cssFile: "soft-pop.css", colors: {"primary":"oklch(0.5106 0.2301 276.9656)","accent":"oklch(0.7686 0.1647 70.0804)","secondary":"oklch(0.7038 0.1230 182.5025)","muted":"oklch(0.9551 0 0)"} },
  { name: "Solar Dusk", value: "solar-dusk", cssFile: "solar-dusk.css", colors: {"primary":"oklch(0.5553 0.1455 48.9975)","accent":"oklch(0.9000 0.0500 74.9889)","secondary":"oklch(0.8276 0.0752 74.4400)","muted":"oklch(0.9363 0.0218 83.2637)"} },
  { name: "Starry Night", value: "starry-night", cssFile: "starry-night.css", colors: {"primary":"oklch(0.4815 0.1178 263.3758)","accent":"oklch(0.6896 0.0714 234.0387)","secondary":"oklch(0.8567 0.1164 81.0092)","muted":"oklch(0.9202 0.0080 106.5563)"} },
  { name: "Sunset Horizon", value: "sunset-horizon", cssFile: "sunset-horizon.css", colors: {"primary":"oklch(0.7357 0.1641 34.7091)","accent":"oklch(0.8278 0.1131 57.9984)","secondary":"oklch(0.9596 0.0200 28.9029)","muted":"oklch(0.9656 0.0176 39.4009)"} },
  { name: "Supabase", value: "supabase", cssFile: "supabase.css", colors: {"primary":"oklch(0.8348 0.1302 160.9080)","accent":"oklch(0.9461 0 0)","secondary":"oklch(0.9940 0 0)","muted":"oklch(0.9461 0 0)"} },
  { name: "T3 Chat", value: "t3-chat", cssFile: "t3-chat.css", colors: {"primary":"oklch(0.5316 0.1409 355.1999)","accent":"oklch(0.8696 0.0675 334.8991)","secondary":"oklch(0.8696 0.0675 334.8991)","muted":"oklch(0.9395 0.0260 331.5454)"} },
  { name: "Tangerine", value: "tangerine", cssFile: "tangerine.css", colors: {"primary":"oklch(0.5316 0.1409 355.1999)","accent":"oklch(0.8696 0.0675 334.8991)","secondary":"oklch(0.8696 0.0675 334.8991)","muted":"oklch(0.9395 0.0260 331.5454)"} },
  { name: "Twitter", value: "twitter", cssFile: "twitter.css", colors: {"primary":"oklch(0.6723 0.1606 244.9955)","accent":"oklch(0.9392 0.0166 250.8453)","secondary":"oklch(0.1884 0.0128 248.5103)","muted":"oklch(0.9222 0.0013 286.3737)"} },
  { name: "Vercel", value: "vercel", cssFile: "vercel.css", colors: {"primary":"oklch(0 0 0)","accent":"oklch(0.9400 0 0)","secondary":"oklch(0.9400 0 0)","muted":"oklch(0.9700 0 0)"} },
  { name: "Vintage Paper", value: "vintage-paper", cssFile: "vintage-paper.css", colors: {"primary":"oklch(0.6180 0.0778 65.5444)","accent":"oklch(0.8348 0.0426 88.8064)","secondary":"oklch(0.8846 0.0302 85.5655)","muted":"oklch(0.9239 0.0190 83.0636)"} },
  { name: "Violet Bloom", value: "violet-bloom", cssFile: "violet-bloom.css", colors: {"primary":"oklch(0.5393 0.2713 286.7462)","accent":"oklch(0.8348 0.0426 88.8064)","secondary":"oklch(0.8846 0.0302 85.5655)","muted":"oklch(0.9239 0.0190 83.0636)"} },
];

export const DEFAULT_THEME = "default";

