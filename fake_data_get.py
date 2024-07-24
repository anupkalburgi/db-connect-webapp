import pandas as pd
from faker import Faker
import random

def generate_sales_data(num_records):
    fake = Faker()
    products = [
        "Apples", "Bananas", "Carrots", "Detergent", "Eggs",
        "Flour", "Grapes", "Honey", "Ice Cream", "Juice",
        "Kale", "Lettuce", "Milk", "Nuts", "Oranges",
        "Pasta", "Quinoa", "Rice", "Sugar", "Tomatoes",
        "Udon", "Vinegar", "Water", "Xylitol", "Yogurt", "Zucchini"
    ]
    
    order_id = 1
    data = {
        "Order ID": [],
        "Date": [],
        "Product": [],
        "Price": [],
        "Zipcode": []
    }
    
    while num_records > 0:
        items_in_order = min(num_records, random.randint(1, 20))
        order_date = fake.date_between(start_date='-1y', end_date='today')
        order_zipcode = fake.zipcode_in_state(state_abbr='NY')
        
        for _ in range(items_in_order):
            data["Order ID"].append(order_id)
            data["Date"].append(order_date)
            data["Product"].append(random.choice(products))
            data["Price"].append(round(random.uniform(1, 100), 2))
            data["Zipcode"].append(order_zipcode)
        
        num_records -= items_in_order
        order_id += 1

    sales_data = pd.DataFrame(data)
    return sales_data

# Generate a dataset with a specified number of records
num_records = 1000
sales_data = generate_sales_data(num_records)

# Save to CSV
file_path = "/Users/anup.kalburgi/code/db-connect-ey/sales_data_with_order_id.csv"
sales_data.to_csv(file_path, index=False)

file_path
