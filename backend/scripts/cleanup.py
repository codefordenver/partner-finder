"""
Additional formating for python files after black has run.
"""
import os


BACKEND_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        os.pardir,
    )
)


EXLUDED_DIRS = frozenset([
    'venv',
    '__pycache__',
])


EXCLUDED_FILENAMES = frozenset([
    __file__,
])


for root, dirs, files in os.walk(BACKEND_DIR):
    print('*' * 120)
    print(root)
    print('')
    excluded_dirs = EXLUDED_DIRS & set(dirs)
    for d in excluded_dirs:
        dirs.remove(d)

    excluded_files = EXCLUDED_FILENAMES & set(files)
    for f in excluded_files:
        files.remove(f)

    for f in files:
        if f.endswith('.py'):
            print(f)
            path = os.path.join(root, f)
            lines = []
            # strip trailing whitespace
            for line in open(path, 'r').readlines():
                lines.append(line.rstrip())
            # add empty line to end of file if one is not present
            if lines and lines[-1] != '':
                lines.append('')

            # write modified lines back to the original file
            open(path, 'w').write('\n'.join(lines))
