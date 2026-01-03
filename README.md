<p align="center">
  <img src="./src/icons/icon-128.png" width="40" /><br>
  <strong style="font-size: 2rem;">YouTube Focus Mode</strong>
</p>

<p align="center">
⭐ YouTube Focus Mode is a lightweight, <strong>open-source</strong> MIT-licensed <strong>browser extension</strong> designed to make YouTube productive and distraction-free. It hides shorts, playables, home feed & search recommendations, comments, and other distracting UI elements, letting you watch only what you choose
</p>

---

🎯 **YouTube Focus Mode** is available here: [Chrome](https://chromewebstore.google.com/detail/youtube-focus-mode-%E2%80%93-no-d/iojlgfppmfhnlmmohajhofjjgnhkcmbg)


## Features

### 🏠 Hide Home Feed & Left Sidebar
| Before | After |
|--------|-------|
| ![Home Feed Before](./screenshots/home-feed/home-feed.png) | ![Home Feed After](./screenshots/home-feed/home-feed-hidden.png) |

### 📊 Stats
| Today | This Week |
|--------|-------|
| ![Today](./screenshots/stats/today.png) | ![This Week ](./screenshots/stats/this-week.png) |


| This Month | All Time |
|--------|-------|
| ![This Month](./screenshots/stats/this-month.png) | ![All Time](./screenshots/stats/all-time.png) |


### 🎯 Hide Shorts
| Before | After |
|--------|-------|
| ![Shorts Before](./screenshots/shorts/shorts.png) | ![Shorts After](./screenshots/shorts/shorts-hidden.png) |

### 🎮 Hide Playables
| Before | After |
|--------|-------|
| ![Playables Before](./screenshots/playables/playables.png) | ![Playables After](./screenshots/playables/playables-hidden.png) |

### 🔍 Hide Search Recommendations
| Before | After |
|--------|-------|
| ![Search Recommendations Before](./screenshots/search/search-recommendations.png) | ![Search Recommendations After](./screenshots/search/search-recommendations-hidden.png) |

### ▶️ Hide On-Watch Recommendations
| Before | After |
|--------|-------|
| ![On-Watch Recommendations Before](./screenshots/on-watch/on-watch-recommendations.png) | ![On-Watch Recommendations After](./screenshots/on-watch/on-watch-recommendations-hidden.png) |

### 💬 Hide Comments
| Before | After |
|--------|-------|
| ![Comments Before](./screenshots/comments/comments.png) | ![Comments After](./screenshots/comments/comments-hidden.png) |

---

## 📁 Project Structure
```
├── screenshots/
├── src/
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-24.png
│   │   ├── icon-32.png
│   │   ├── icon-64.png
│   │   ├── icon-128.png
│   │   └── youtube.png
│   ├── popup/
│   │   ├── popup.css
│   │   ├── popup.html
│   │   └── popup.js
│   ├── scripts/
│   │   ├── features/
|   │   │   ├── home-feed.js
|   │   │   ├── on-watch-recommendations.js
|   │   │   ├── shorts.js
│   │   ├── content.js
│   │   ├── storage.js
│   ├── styles/
│   │   ├── content.css
│   └── manifest.json
├── .gitignore
├── LICENSE
└── PRIVACY.md
└── README.md
```

---

## 🛠️ Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome and go to: `chrome://extensions/`
3. Enable **Developer mode** (top-right)
4. Click **Load unpacked**
5. Select the `src/` folder
6. YouTube Focus Mode will appear in your Extensions list

---

## 🔒 Privacy

YouTube Focus Mode is privacy-first. It does **not**:

- Collect or track user data  
- Use analytics  
- Send any information to external servers  

All functionality runs **locally** in your browser.

---

## 🙌 Credits
The main icon used in this project is provided by:
- Flaticon – [Play button icons created by Alfredo Hernandez](https://www.flaticon.com/free-icons/play-button)  
