# Arts of Flowers - Performance Optimization Project

## Project Overview
This project focuses on front-end performance analysis and optimization. It demonstrates real-world techniques used to minimize load times, eliminate layout shifts, and lower JavaScript thread execution time.

## How to Test Performance
1. Extract the submission ZIP file.
2. Open `index.html` in Chrome or Microsoft Edge.
3. Open **DevTools** (`F12`) -> **Lighthouse Tab**.
4. Select **Categories: Performance** and **Device: Mobile / Desktop**.
5. Click **Analyze page load** to verify performance scores (95+ expected).

## Performance Highlights
* Minified CSS & JS payloads.
* Zero Cumulative Layout Shift (CLS).
* Native image lazy-loading and resource hints.
* Efficient batch DOM insertion using `DocumentFragment`.