import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--window-size=1920,1080")

    chrome_options.set_capability("goog:loggingPrefs", {"performance": "ALL"})

    service = Service('C:\\chromedriver-win64\\chromedriver.exe')
    
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def measure_load_time(driver, url, ready_selector, timeout=30):
    try:
        start_time = time.time()

        driver.get(url)
        
        WebDriverWait(driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ready_selector))
        )
        end_time = time.time()
        
        load_time = end_time - start_time
        print(f"Load Time: {load_time:.2f} seconds")
        logs = driver.get_log("performance")
        events = [json.loads(log["message"])["message"] for log in logs]
        assets = {}
        
        for event in events:
            method = event.get("method")
            params = event.get("params")
            if method == "Network.responseReceived":
                request_id = params.get("requestId")
                response = params.get("response")
                url = response.get("url")
                mime_type = response.get("mimeType")
                status = response.get("status")
                if url:
                    assets[request_id] = {
                        "url": url,
                        "mimeType": mime_type,
                        "status": status,
                        "encodedDataLength": 0,
                        "decodedBodyLength": 0,
                        "timing": {},
                    }
            elif method == "Network.loadingFinished":
                request_id = params.get("requestId")
                encoded_data_length = params.get("encodedDataLength", 0)
                if request_id in assets:
                    assets[request_id]["encodedDataLength"] = encoded_data_length
            elif method == "Network.loadingFailed":
                request_id = params.get("requestId")
                if request_id in assets:
                    assets[request_id]["status"] = "Failed"
        total_size = sum(asset["encodedDataLength"] for asset in assets.values())
        print(f"Total Loaded Assets Size: {total_size / 1024:.2f} KB")
        
        return load_time, assets
    except Exception as e:
        print(f"Error measuring load time: {e}")
        return None, {}

def main():
    driver = setup_driver()
    
    try:
        game_url = "https://dino-game-cs-455.vercel.app/" 
        ready_selector = "#game"

        load_time, assets = measure_load_time(driver, game_url, ready_selector)

        if assets:
            sorted_assets = sorted(assets.values(), key=lambda x: x["encodedDataLength"], reverse=True)
            top_n = 10
            print("\nTop 10 Largest Assets:")
            for asset in sorted_assets[:top_n]:
                size_kb = asset["encodedDataLength"] / 1024
                print(f"{asset['url']} - {size_kb:.2f} KB - MIME Type: {asset['mimeType']} - Status: {asset['status']}")
        
            # Log the load time and assets
            with open("load_times.txt", "a") as f:
                f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} - Load Time: {load_time:.2f}s - Total Assets Size: {sum(a['encodedDataLength'] for a in assets.values()) / 1024:.2f}KB\n")
                f.write("Top 10 Largest Assets:\n")
                for asset in sorted_assets[:top_n]:
                    f.write(f"{asset['url']} - {asset['encodedDataLength'] / 1024:.2f} KB - {asset['mimeType']} - {asset['status']}\n")
                f.write("\n")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
