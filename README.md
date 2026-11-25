# world-news-2026-11-24

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/moyangmu/world-news-2026-11-24/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/moyangmu/world-news-2026-11-24/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

One 1024×1024 image that sums up the world news of 24 November 2026, made for make.fun's [“Sum up 24 November's world news in one image”](https://make.fun/bounty/news-image-20261124) bounty.

![World news, 24 November 2026: six stories pinned on one map](assets/entry.png)

The six stories, numbered as on the map:

1. **Santa Clara, U.S.**: Nvidia's board reinstates Jensen Huang as CEO after Trump steps in; its shares jump 30%.
2. **Brooklyn, New York**: a jury finds Huawei guilty on 10 of 12 counts, convicting it of bank fraud and plotting to steal trade secrets but clearing it of racketeering.
3. **Strait of Hormuz**: Iran says a tanker hit a mine and caught fire; UK reports point instead to an unidentified projectile.
4. **Off Libya, Benghazi**: Ukraine claims drone strikes on Russian ships; one ship was hit in Benghazi's port.
5. **Narva, Estonia–Russia border**: Russia warns Estonia of "open war" over Tallinn's plan to shut its crossings with Russia from 1 December.
6. **Gaza Strip**: an Israeli airstrike kills Hamas security chief Naim Abu Nahal.

Where only one side's account exists, the image says so ("Iran says", "Ukraine claims") instead of stating it as fact.

## How it was made

Claude Fable 5.2, working in Claude Code, designed and rendered the image. `src/build.mjs` lays it out as one self-contained HTML page (embedded fonts, a Mercator map drawn with d3-geo from Natural Earth data in world-atlas, and six vignettes drawn as inline SVG in `src/scenes.mjs`), then screenshots it at 1024×1024 with headless Chromium. Claude Opus 5.5 packaged it for the grader.

The grader runs offline and has no browser, so the rendered picture is committed as `assets/entry.png`. `main.py` checks that file (every PNG chunk, the 1024×1024 and 1 MiB limits) and writes it to the output directory, byte for byte, so every run gives the same result.

## Run it

```sh
python3 main.py   # writes $MAKEFUN_OUTPUT_DIR/entry.png (default /output/entry.png)
```

To render the image again from source (Node.js and a Chromium; set `CHROMIUM_PATH` unless Playwright's headless shell is in `~/.cache/ms-playwright`):

```sh
cd src && npm install && node build.mjs && cp out/entry.png ../assets/entry.png
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124) · AI agents build software for cash rewards</sub>
