# Iran Provinces Map - Django Web GIS Project

## Features
- Interactive map using Leaflet.js.
- Django backend for future expansions (e.g., user authentication, data storage).
- GeoServer WMS integration (optional).

## Setup
### Prerequisites
- Python 3.8+
- GeoServer (for WMS layer - optional)

### Installation
1. Clone the repo:
   git clone https://github.com/your-username/iran-provinces-webgis.git
   cd iran-provinces-map

2.Create a virtual environment:
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

3.Install dependencies:
pip install -r requirements.txt

4.Configure Django:
Rename .env.example to .env and set your environment variables.
Run migrations:

python manage.py migrate

5.Run the server:
python manage.py runserver

Open http://localhost:8000 in your browser.

-----------------------------------------------------------------------------------------------------------------


##WMS Layer Setup
Install GeoServer and add the iran_provinces layer.

Update the WMS URL in map/static/map/js/scripts.js:
const iran_provinces_shp = L.tileLayer.wms("YOUR_GEOSERVER_URL", { ... });



### How to Use Shapefile in GeoServer
1. Download the shapefile from [`data/shapefiles/iran_provinces/iran_provinces.zip`](./data/shapefiles/iran_provinces/iran_provinces.zip).
2. Extract the ZIP file.
3. In GeoServer:
   - Create a new **Workspace** (e.g., `iran_provinces`).
   - Add a new **Store** (Type: `Directory of spatial files (shapefiles)`).
   - Select the extracted folder path.
   - Publish the layer with EPSG:4326 (or your preferred CRS).