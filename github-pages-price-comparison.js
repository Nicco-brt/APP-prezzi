// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#ffffff">
  <title>Price Comparison Tool</title>
  <!-- Adjusted paths for GitHub Pages -->
  <link rel="manifest" href="./manifest.json">
  <link rel="apple-touch-icon" href="./icons/icon-192x192.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    .app-container {
      max-width: 100%;
      padding-bottom: 70px; /* Space for bottom navigation */
    }
    @media (min-width: 768px) {
      .app-container {
        max-width: 768px;
        margin: 0 auto;
      }
    }
  </style>
</head>
<body>
  <div id="root" class="app-container"></div>
  <!-- App shell while loading -->
  <div id="loading" class="fixed inset-0 flex items-center justify-center bg-white z-50">
    <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/recharts/2.1.9/Recharts.min.js"></script>
  
  <script>
    // Dynamically determine the base path for GitHub Pages
    const getBasePath = () => {
      const pathArray = window.location.pathname.split('/');
      // If deployed at root, this will be empty. If in a repo, this will be the repo name
      const repoName = pathArray[1] === '' ? '' : '/' + pathArray[1];
      return window.location.origin + repoName;
    };

    // Register service worker with correct path for GitHub Pages
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const basePath = getBasePath();
        navigator.serviceWorker.register(`${basePath}/service-worker.js`, {
          scope: basePath + '/'
        })
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  </script>
  
  <script src="./app.js" defer></script>
</body>
</html>

// manifest.json
{
  "name": "Price Comparison Tool",
  "short_name": "PriceComp",
  "description": "Compare prices across different stores",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "./icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "./icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "./icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "./icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "./icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "./icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "./icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "./icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}

// service-worker.js
// Dynamic path determination for GitHub Pages
self.addEventListener('install', event => {
  const basePath = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/'));
  
  const CACHE_NAME = 'price-comparison-v1';
  const urlsToCache = [
    `${basePath}/`,
    `${basePath}/index.html`,
    `${basePath}/app.js`,
    `${basePath}/manifest.json`,
    `${basePath}/icons/icon-72x72.png`,
    `${basePath}/icons/icon-96x96.png`,
    `${basePath}/icons/icon-128x128.png`,
    `${basePath}/icons/icon-144x144.png`,
    `${basePath}/icons/icon-152x152.png`,
    `${basePath}/icons/icon-192x192.png`,
    `${basePath}/icons/icon-384x384.png`,
    `${basePath}/icons/icon-512x512.png`,
    'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/recharts/2.1.9/Recharts.min.js'
  ];

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Cache important resources that weren't pre-cached
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open('price-comparison-v1')
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

// Update caches when a new service worker is activated
self.addEventListener('activate', event => {
  const cacheWhitelist = ['price-comparison-v1'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// app.js with the Price Comparison component
const appCode = `
// Price Comparison component
const { useState, useEffect } = React;
const { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} = Recharts;

const PriceComparison = () => {
  // Component implementation would be here - this is a placeholder for the
  // actual code from the previous artifact that would be transpiled properly
  
  const [items, setItems] = useState([
    { id: 1, name: '', prices: [{ store: '', price: '' }], expanded: true }
  ]);
  const [activeTab, setActiveTab] = useState('items');
  
  // Implementation details removed for brevity

  return (
    <div className="w-full max-w-md mx-auto border rounded-lg bg-white shadow-sm my-4">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Price Comparison</h1>
      </div>
      <div className="p-4 pb-16">
        <p>Loading app content...</p>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around">
        <button className="w-1/2 py-3 text-blue-600">Items</button>
        <button className="w-1/2 py-3">Analysis</button>
      </div>
    </div>
  );
};

// Initialize the app with service worker status detection
document.addEventListener('DOMContentLoaded', () => {
  const loadingElement = document.getElementById('loading');
  
  // When app loads, check if we're running from installed PWA
  const isInStandaloneMode = () => 
    (window.matchMedia('(display-mode: standalone)').matches) || 
    (window.navigator.standalone) || 
    document.referrer.includes('android-app://');
  
  // Function to render the app
  const renderApp = () => {
    ReactDOM.render(
      React.createElement(PriceComparison),
      document.getElementById('root'),
      () => {
        // Hide loading spinner once rendered
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      }
    );
  };
  
  // Render the app regardless of installation state
  renderApp();
  
  // If we're not in standalone mode, suggest installation after 2 seconds
  setTimeout(() => {
    if (!isInStandaloneMode() && loadingElement && 'serviceWorker' in navigator) {
      const installBanner = document.createElement('div');
      installBanner.className = 'fixed bottom-0 left-0 right-0 bg-blue-100 p-4 text-center';
      installBanner.innerHTML = 'Add this app to your home screen for the best experience!';
      document.body.appendChild(installBanner);
      
      // Auto-hide the banner after 7 seconds
      setTimeout(() => {
        installBanner.style.display = 'none';
      }, 7000);
    }
  }, 2000);
});
`;

// Save this to app.js
