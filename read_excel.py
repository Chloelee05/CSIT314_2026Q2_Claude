import subprocess, sys, io
subprocess.run(['pip', 'install', 'xlrd'], capture_output=True)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import xlrd

path = r'c:\Users\leeha\OneDrive\바탕 화면\chloe\CS folder\UOW 자료\FYP\FYP-26-S2-24_Project Plan_Implm of online auction platform.xls'
wb = xlrd.open_workbook(path)
print('Sheet names:', wb.sheet_names())

for name in wb.sheet_names():
    sheet = wb.sheet_by_name(name)
    print(f'\n=== {name} === (rows={sheet.nrows}, cols={sheet.ncols})')
    for r in range(sheet.nrows):
        row_data = []
        for c in range(sheet.ncols):
            val = sheet.cell_value(r, c)
            if val:
                row_data.append(f'[{c}]{val}')
        if row_data:
            sep = ' | '
            print(f'  R{r}: {sep.join(row_data)}')
