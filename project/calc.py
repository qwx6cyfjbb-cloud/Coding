import tkinter as tk
from tkinter import messagebox

# Functions
def add():
    try:
        num1 = float(entry1.get())
        num2 = float(entry2.get())
        result = num1 + num2
        result_label.config(text=f"Result: {result}") # Updated f-string
    except ValueError:
        messagebox.showerror("Input Error", "Please enter numbers only.")

def substract():
    try:
        num1 = float(entry1.get())
        num2 = float(entry2.get())
        # Logical check: Removing this constraint usually makes more sense for a calculator
        # if num1 < num2:
        #     messagebox.showerror("Input Error", "First number should be greater than or equal to second number.")
        #     return
        result = num1 - num2
        result_label.config(text=f"Result: {result}")
    except ValueError:
        messagebox.showerror("Input Error", "Please enter numbers only.")

def multiply():
    try:
        num1 = float(entry1.get())
        num2 = float(entry2.get())
        result = num1 * num2
        result_label.config(text=f"Result: {result}")
    except ValueError:
        messagebox.showerror("Input Error", "Please enter numbers only.")
        
def divide():
    try:
        num1 = float(entry1.get())
        num2 = float(entry2.get())
        result = num1 / num2
        result_label.config(text=f"Result: {result}")
    except ZeroDivisionError:
        messagebox.showerror("Input Error", "Cannot divide by zero.")
    except ValueError:
        messagebox.showerror("Input Error", "Please enter numbers only.")

#Ui elements
root = tk.Tk()
root.title("Simple Calculator")
root.geometry("500x500")
root.config(bg="white")

# Added font color='black' to ensure it's visible on 'white' entry background
entry1 = tk.Entry(root, font=("Arial", 20), bg="white", fg="blue")
entry1.pack(pady=20)
entry2 = tk.Entry(root, font=("Arial", 20), bg="white", fg="blue")
entry2.pack(pady=20)

# Added missing result_label
result_label = tk.Label(root, text="Result: ", font=("Arial", 20), bg="black", fg="white")
result_label.pack(pady=20)

add_button = tk.Button(root, text="Add", font=("Arial", 20), bg="blue", fg="white", command=add)
add_button.pack(pady=10)
subtract_button = tk.Button(root, text="Subtract", font=("Arial", 20), bg="blue", fg="white", command=substract)
subtract_button.pack(pady=10)
multiply_button = tk.Button(root, text="Multiply", font=("Arial", 20), bg="blue", fg="white", command=multiply)
multiply_button.pack(pady=10)
divide_button = tk.Button(root, text="Divide", font=("Arial", 20), bg="blue", fg="white", command=divide)
divide_button.pack(pady=10)
if __name__ == "__main__":
    root.mainloop() # Essential for rendering