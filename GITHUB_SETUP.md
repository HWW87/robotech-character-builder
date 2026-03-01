# 🚀 Instrucciones para Subir a GitHub

Tu repositorio local está listo. Sigue estos pasos para subirlo a GitHub:

## Opción 1: Crear un repo NUEVO en GitHub (Recomendado)

### Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Completa los campos:
   - **Repository name**: `robotech-character-builder`
   - **Description**: "Interactive Robotech RPG Character Builder with React + Vite"
   - **Visibility**: Público (Public) o Privado (Private)
   - **README**: No (ya lo tenemos)
   - **gitignore**: No (ya lo tenemos)
   - **License**: MIT (Recomendado)
3. Haz clic en "Create repository"

### Paso 2: Conectar repositorio local con GitHub

Copia y ejecuta estos comandos en PowerShell (en la carpeta del proyecto):

```powershell
cd "c:\Rol\Robotech\Fichas\Robotech Character Builder"

# Renombra la rama por defecto a 'main'
git branch -M main

# Añade el repositorio remoto (REEMPLAZA 'YOUR_USERNAME' con tu usuario de GitHub)
git remote add origin https://github.com/YOUR_USERNAME/robotech-character-builder.git

# Sube los cambios
git push -u origin main
```

Cuando ejecutes `git push`, te pedirá autenticación. Tienes dos opciones:

#### Opción A: Token de Acceso Personal (Recomendado)
1. Ve a https://github.com/settings/tokens
2. Haz clic en "Generate new token" → "Generate new token (classic)"
3. Dale un nombre: `robotech-cli`
4. Selecciona permisos: ✅ repo (completo)
5. Expira en: 90 días (o lo que prefieras)
6. Haz clic en "Generate token"
7. Copia el token (aparece una sola vez)
8. Cuando Git pida contraseña, pega el token

#### Opción B: SSH (Más seguro para largo plazo)
1. Genera clave SSH:
   ```powershell
   ssh-keygen -t ed25519 -C "tu-email@example.com"
   # Presiona Enter 3 veces para aceptar valores por defecto
   ```

2. Ve a https://github.com/settings/keys
3. Haz clic en "New SSH key"
4. Lee tu clave pública:
   ```powershell
   Get-Content $HOME\.ssh\id_ed25519.pub
   ```
5. Cópiala íntegra en GitHub
6. Cambia la URL remota a SSH:
   ```powershell
   git remote set-url origin git@github.com:YOUR_USERNAME/robotech-character-builder.git
   ```

---

## Opción 2: Si ya tienes repo en GitHub

Si ya creaste un repositorio vacío, solo ejecuta:

```powershell
cd "c:\Rol\Robotech\Fichas\Robotech Character Builder"

git remote add origin https://github.com/YOUR_USERNAME/robotech-character-builder.git
git branch -M main
git push -u origin main
```

---

## Verificar que subió correctamente

Después de `git push`, verifica visitando:  
`https://github.com/YOUR_USERNAME/robotech-character-builder`

Deberías ver:
- ✅ Todos tus archivos (src/, public/, etc.)
- ✅ README.md renderizado
- ✅ Commit history con tu "Initial commit"

---

## Comandos útiles para después

```powershell
# Ver estado
git status

# Crear nueva rama para features
git checkout -b feature/nueva-pantalla

# Commit y push
git add .
git commit -m "Add: nueva pantalla"
git push origin feature/nueva-pantalla

# Actualizar desde GitHub
git pull origin main
```

---

## 🔗 Próximos pasos (Opcional)

- **GitHub Pages**: Activa en Settings → Pages → Deploy from branch main
- **CI/CD**: Configura GitHub Actions para tests automáticos
- **Releases**: Crea tags y releases para versiones

---

¿Necesitas ayuda con algún paso? Déjame saber.
