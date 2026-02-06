
import os
import django
import sys

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings')
django.setup()

from database.models.users import Candidates

def fix_candidates():
    print("Checking for deleted candidates...")
    # Find all candidates marked as deleted
    deleted_candidates = Candidates.objects.filter(isdeleted=True)
    count = deleted_candidates.count()
    
    if count > 0:
        print(f"Found {count} deleted candidates. Restoring...")
        # Update them to be active
        updated = deleted_candidates.update(isdeleted=False)
        print(f"Successfully restored {updated} candidate profiles.")
    else:
        print("No deleted candidates found. All clear.")

if __name__ == "__main__":
    try:
        fix_candidates()
    except Exception as e:
        print(f"Error: {e}")
