# Hotel guests can choose the type of meal ---Done.
# The guests can choose the specific option.
# Then, the chef receives a notification in the kitchen to prepare it.

def choose_meal():
    ask_name = input('Please enter your name')
    # meal options:
    # By using a set in Python, options can be modified and unordered. A list will also work.
    breakfast_options = {'toasts', 'pancakes', 'croissants'}
    lunch_options = {'butternut', 'poke bowl with tofu', 'vegan quiche'}
    dinner_options = {'pizza', 'risotto', 'tofu with salad'}

    which_meal = input(f"Which type of meal would you like to have {ask_name}: choose one option among breakfast, lunch or dinner?")

    # if which_meal == 'breakfast' or which_meal == 'breakfasts':
    if which_meal in ['breakfast', 'breakfasts']:
        print(f'For breakfast we have{breakfast_options}')
        choice = input(
            f"Which breakfast would you like the chef to make {ask_name} ?")
        # Only for pancakes we warm for 30 mins waiting time:
        if choice == 'pancakes':
            print('Your pancakes will be ready and brought to your room in approx 30 mins.')
        else:
            print("In approx 25 mins a colleague will bring your chosen breakfast")
    elif which_meal in ['lunch']:
        print(f'For lunch we have{lunch_options}')
        choice = input(
            f"Which lunch would you like to have {ask_name} ?")
        if choice == 'butternut':
            print('Your meal will be ready and brought to your room in approx 45 mins.')
        else:
            print("In approx 35 mins a colleague will bring your chosen breakfast")
    elif which_meal in ['dinner', 'diner']:
        print(f'For dinner we have{dinner_options}')
    else:
        print('For all other meals or snacks, please come to the reception bar')

    return which_meal

# If import this file somewhere else, this block is completely ignored
if __name__ == "__main__":
    choose_meal()
