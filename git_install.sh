yum update
yum install git -y
git --version

# 1. Inicializar el repositorio local
git init

# 2. Agregar el repositorio remoto (enlace de GitHub)
git remote add origin https://github.com/pablomartin00/vdoc_frontend.git

# 3. Agregar todos los archivos en el directorio actual al área de staging
git add .

# 4. Hacer el commit inicial
git commit -m "Initial commit"

# 5. Subir el commit al repositorio remoto en la rama principal (main o master)
# (Reemplaza `main` con `master` si tu repositorio en GitHub usa esa rama por defecto)
git branch -M main
git push -u origin main
