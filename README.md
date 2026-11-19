# Daycast weather dashboard

Daycast shows current temperature, weather conditions, and seven days of forecast highs and lows. It opens in Elizabeth, New Jersey. Search for a city or postal code, select a matching location, and switch between °F and °C. Click **Refresh weather** to fetch a new forecast.

## Run on your Mac

Extract the ZIP and open index.html in your browser. An internet connection is required for weather and location searches. The project uses HTML, CSS, and JavaScript. No build or API key is needed.

## Upload to GitHub

1. Create a public repository named weather-dashboard and initialize it with a README.
2. Open the repository and select **Add file**, then **Upload files**.
3. Drag index.html, app.js, and style.css into the upload area. You can also upload this README.md to replace the starter README.
4. Select **Commit changes**.

## Publish with GitHub Pages

Open **Settings**, then **Pages**. Under **Build and deployment**, select **Deploy from a branch**. Choose **main** and **/(root)**, then save. Once deployment finishes, use the site link shown on the Pages screen.

## Data

[Open-Meteo Weather API](https://open-meteo.com/en/docs) provides model-based current conditions and forecasts. [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) uses GeoNames location data. Times shown are local to the selected city. The public endpoint is intended for non-commercial use.
