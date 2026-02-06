"""
Enhanced Scraper Sources Configuration
Improved scrapers for Dvago and other pharmacy websites
"""
from typing import Dict, List, Optional
from scraper_utils import *
import logging
import json
import re

logger = logging.getLogger(__name__)


class BaseScraper:
    """Base scraper class"""
    
    def __init__(self, source_name: str, base_url: str):
        self.source_name = source_name
        self.base_url = base_url
        self.scraped_data = []
    
    def scrape(self) -> List[Dict]:
        """Main scrape method - to be overridden"""
        raise NotImplementedError
    
    def get_category_urls(self) -> List[str]:
        """Get category/listing URLs"""
        raise NotImplementedError


class DvagoScraperEnhanced(BaseScraper):
    """Enhanced scraper for dvago.pk with better extraction"""
    
    def __init__(self):
        super().__init__("dvago", "https://www.dvago.pk")
    
    def get_category_urls(self) -> List[str]:
        """Get product listing URLs from Dvago"""
        categories = [
            "/collections/all-medicines",
            "/collections/prescription-medicines",
            "/collections/otc-medicines",
            "/collections/vitamins-supplements",
            "/collections/diabetes-care",
            "/collections/pain-relief",
            "/collections/cold-flu",
            "/collections/digestive-health",
            "/collections/heart-health",
            "/collections/blood-pressure",
            "/collections/womens-health",
            "/collections/mens-health",
            "/collections/baby-care",
            "/collections/first-aid",
        ]
        
        urls = []
        for cat in categories:
            # Dvago uses pagination
            for page in range(1, 4):  # Scrape first 3 pages of each category
                urls.append(f"{self.base_url}{cat}?page={page}")
        
        return urls
    
    def scrape(self) -> List[Dict]:
        """Scrape dvago.pk with enhanced extraction"""
        logger.info(f"Starting enhanced {self.source_name} scraper...")
        
        category_urls = self.get_category_urls()
        
        for url in category_urls:
            sleep_random(5, 10)  # Respectful delay
            
            logger.info(f"Scraping: {url}")
            response = make_request(url)
            if not response:
                continue
            
            soup = parse_html(response.text)
            if not soup:
                continue
            
            # Multiple selectors for Dvago's product cards
            product_selectors = [
                'div.product-card',
                'div.product-item',
                'div[class*="product"]',
                'article.product',
                'li.product',
            ]
            
            products = []
            for selector in product_selectors:
                products = soup.select(selector)
                if products:
                    logger.info(f"Found {len(products)} products with selector: {selector}")
                    break
            
            if not products:
                logger.warning(f"No products found on {url}")
                continue
            
            for product in products:
                try:
                    data = self._parse_product_enhanced(product, url)
                    if data and validate_medicine_data(data):
                        self.scraped_data.append(data)
                except Exception as e:
                    logger.error(f"Error parsing product: {e}")
                    continue
        
        logger.info(f"Scraped {len(self.scraped_data)} items from {self.source_name}")
        return self.scraped_data
    
    def _parse_product_enhanced(self, product_element, source_url: str) -> Optional[Dict]:
        """Enhanced product parsing for Dvago"""
        
        # Extract product name with multiple strategies
        name_elem = None
        name_selectors = [
            'h3.product-title',
            'h4.product-title',
            'a.product-title',
            'div.product-title',
            'h3',
            'h4',
            'a[href*="/products/"]',
        ]
        
        for selector in name_selectors:
            name_elem = product_element.select_one(selector)
            if name_elem:
                break
        
        if not name_elem:
            return None
        
        medicine_name = clean_text(name_elem.get_text())
        if not medicine_name or len(medicine_name) < 3:
            return None
        
        # Extract price with multiple strategies
        price = None
        price_selectors = [
            'span.price',
            'div.price',
            'span.product-price',
            'div.product-price',
            'span[class*="price"]',
            'div[class*="price"]',
        ]
        
        for selector in price_selectors:
            price_elem = product_element.select_one(selector)
            if price_elem:
                price_text = price_elem.get_text()
                price = extract_price(price_text)
                if price:
                    break
        
        # Extract image with multiple strategies
        image_url = None
        img_selectors = [
            'img.product-image',
            'img.product-img',
            'img[class*="product"]',
            'img',
        ]
        
        for selector in img_selectors:
            img_elem = product_element.select_one(selector)
            if img_elem:
                image_url = extract_image_url(img_elem, self.base_url)
                if image_url:
                    break
        
        # Extract product URL
        product_url = None
        link_elem = product_element.select_one('a[href*="/products/"]') or product_element.select_one('a')
        if link_elem and link_elem.get('href'):
            product_url = urljoin(self.base_url, link_elem['href'])
        
        # Extract company from product name or separate field
        company = None
        company_elem = product_element.select_one('.product-vendor') or product_element.select_one('.vendor')
        if company_elem:
            company = clean_text(company_elem.get_text())
        
        # Normalize medicine name
        medicine_name_clean = normalize_medicine_name(medicine_name)
        
        # Extract details from name
        strength = extract_strength(medicine_name_clean)
        pack_size = extract_pack_size(medicine_name_clean)
        category = categorize_medicine(medicine_name_clean)
        disease = detect_disease(medicine_name_clean)
        
        # Check availability
        availability = "In Stock"
        stock_elem = product_element.select_one('.stock-status') or product_element.select_one('[class*="stock"]')
        if stock_elem:
            stock_text = stock_elem.get_text().lower()
            if 'out' in stock_text or 'sold' in stock_text:
                availability = "Out of Stock"
        
        return {
            'medicine_name': medicine_name_clean,
            'company': company,
            'category': category,
            'disease': disease,
            'strength': strength,
            'pack_size': pack_size,
            'min_price': price,
            'max_price': price,
            'avg_price': price,
            'availability': availability,
            'image_url': image_url,
            'source_url': product_url or source_url,
            'source_pharmacy': self.source_name,
        }
    
    def scrape_product_detail(self, product_url: str) -> Optional[Dict]:
        """Scrape detailed product page"""
        sleep_random(3, 6)
        
        response = make_request(product_url)
        if not response:
            return None
        
        soup = parse_html(response.text)
        if not soup:
            return None
        
        # Extract additional details from product page
        details = {}
        
        # Description
        desc_elem = soup.select_one('.product-description') or soup.select_one('[class*="description"]')
        if desc_elem:
            details['description'] = truncate_text(clean_text(desc_elem.get_text()), 500)
        
        # Usage/Indications
        usage_elem = soup.select_one('.product-usage') or soup.select_one('[class*="usage"]')
        if usage_elem:
            details['usage'] = truncate_text(clean_text(usage_elem.get_text()), 500)
        
        return details


class DawaaiScraperEnhanced(BaseScraper):
    """Enhanced scraper for dawaai.pk"""
    
    def __init__(self):
        super().__init__("dawaai", "https://dawaai.pk")
    
    def get_category_urls(self) -> List[str]:
        categories = [
            "/medicines",
            "/otc-products",
            "/vitamins-supplements",
            "/baby-care",
            "/personal-care",
            "/health-devices",
        ]
        
        urls = []
        for cat in categories:
            for page in range(1, 3):
                urls.append(f"{self.base_url}{cat}?page={page}")
        
        return urls
    
    def scrape(self) -> List[Dict]:
        logger.info(f"Starting enhanced {self.source_name} scraper...")
        
        category_urls = self.get_category_urls()
        
        for url in category_urls:
            sleep_random(5, 10)
            
            response = make_request(url)
            if not response:
                continue
            
            soup = parse_html(response.text)
            if not soup:
                continue
            
            products = soup.select('div.product, article.product, li.product-item')
            
            for product in products:
                try:
                    data = self._parse_product(product, url)
                    if data and validate_medicine_data(data):
                        self.scraped_data.append(data)
                except Exception as e:
                    logger.error(f"Error parsing product: {e}")
                    continue
        
        logger.info(f"Scraped {len(self.scraped_data)} items from {self.source_name}")
        return self.scraped_data
    
    def _parse_product(self, product_element, source_url: str) -> Optional[Dict]:
        name_elem = product_element.select_one('h2, h3, h4, .product-name')
        if not name_elem:
            return None
        
        medicine_name = normalize_medicine_name(clean_text(name_elem.get_text()))
        
        price_elem = product_element.select_one('.price, .product-price')
        price = extract_price(price_elem.get_text()) if price_elem else None
        
        img_elem = product_element.select_one('img')
        image_url = extract_image_url(img_elem, self.base_url)
        
        return {
            'medicine_name': medicine_name,
            'company': None,
            'category': categorize_medicine(medicine_name),
            'disease': detect_disease(medicine_name),
            'strength': extract_strength(medicine_name),
            'pack_size': extract_pack_size(medicine_name),
            'min_price': price,
            'max_price': price,
            'avg_price': price,
            'availability': 'Available',
            'image_url': image_url,
            'source_url': source_url,
            'source_pharmacy': self.source_name,
        }


class ServaidScraper(BaseScraper):
    """Scraper for servaid.com.pk"""
    
    def __init__(self):
        super().__init__("servaid", "https://servaid.com.pk")
    
    def get_category_urls(self) -> List[str]:
        return [
            f"{self.base_url}/shop",
            f"{self.base_url}/medicines",
            f"{self.base_url}/otc",
        ]
    
    def scrape(self) -> List[Dict]:
        logger.info(f"Starting {self.source_name} scraper...")
        
        for url in self.get_category_urls():
            sleep_random(5, 10)
            response = make_request(url)
            if not response:
                continue
            
            soup = parse_html(response.text)
            if not soup:
                continue
            
            products = soup.select('div.product, li.product')
            
            for product in products:
                try:
                    name_elem = product.select_one('h3, h4, .product-title')
                    if not name_elem:
                        continue
                    
                    medicine_name = normalize_medicine_name(clean_text(name_elem.get_text()))
                    
                    price_elem = product.select_one('.price')
                    price = extract_price(price_elem.get_text()) if price_elem else None
                    
                    img_elem = product.select_one('img')
                    image_url = extract_image_url(img_elem, self.base_url)
                    
                    data = {
                        'medicine_name': medicine_name,
                        'company': None,
                        'category': categorize_medicine(medicine_name),
                        'disease': detect_disease(medicine_name),
                        'strength': extract_strength(medicine_name),
                        'pack_size': extract_pack_size(medicine_name),
                        'min_price': price,
                        'max_price': price,
                        'avg_price': price,
                        'availability': 'In Stock',
                        'image_url': image_url,
                        'source_url': url,
                        'source_pharmacy': self.source_name,
                    }
                    
                    if validate_medicine_data(data):
                        self.scraped_data.append(data)
                        
                except Exception as e:
                    logger.error(f"Error: {e}")
        
        logger.info(f"Scraped {len(self.scraped_data)} items from {self.source_name}")
        return self.scraped_data


# Registry of all scrapers
SCRAPER_REGISTRY = {
    'dvago': DvagoScraperEnhanced,
    'dawaai': DawaaiScraperEnhanced,
    'servaid': ServaidScraper,
}


def get_scraper(source_name: str) -> Optional[BaseScraper]:
    """Get scraper instance by name"""
    scraper_class = SCRAPER_REGISTRY.get(source_name.lower())
    if scraper_class:
        return scraper_class()
    return None


def get_all_scrapers() -> List[BaseScraper]:
    """Get all available scrapers"""
    return [scraper_class() for scraper_class in SCRAPER_REGISTRY.values()]
