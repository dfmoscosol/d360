import glob, os
target = """                mapDays={({ date }) => {
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  if (date.toDate() < now) {
                    return {
                      disabled: true,
                      style: { color: "#ccc" }
                    };
                  }
                }}"""
target_comment = """                /* mapDays={({ date }) => {
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  if (date.toDate() < now) {
                    return { disabled: true, style: { color: "#ccc" } };
                  }
                }} */"""

for file in glob.glob("src/pages/Eventos/**/*.jsx", recursive=True):
    with open(file, "r") as f:
        content = f.read()
    if target in content:
        content = content.replace(target, "minDate={today}")
        with open(file, "w") as f:
            f.write(content)
        print(f"Reverted {file}")
    if target_comment in content:
        content = content.replace(target_comment, "//minDate={today}")
        with open(file, "w") as f:
            f.write(content)
        print(f"Reverted {file} (commented)")
