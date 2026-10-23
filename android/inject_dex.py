import sys, zipfile, shutil
src, dex, out = sys.argv[1], sys.argv[2], sys.argv[3]
shutil.copy(src, out)
with zipfile.ZipFile(out, 'a') as z:
    z.write(dex, 'classes.dex')
print('dex injected ->', out)
