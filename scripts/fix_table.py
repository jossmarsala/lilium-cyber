with open('docs/docs.md', 'r') as f:
    lines = f.readlines()

new_table = (
    "| Modelo de Servicio | Definición | Lo que administra el Proveedor de la Nube | Lo que debe proteger y configurar el Cliente |\n"
    "| --- | --- | --- | --- |\n"
    "| **IaaS** — _Infrastructure as a Service_ | El proveedor alquila infraestructura básica (servidores virtuales, almacenamiento y redes). El cliente controla todo lo que corre encima. *Ejemplo: AWS EC2, Azure VM, Google Compute Engine.* | La infraestructura física, los centros de datos, la energía, los servidores base y el hipervisor. | El sistema operativo instalado, sus parches, el firewall de red, las aplicaciones y los datos. |\n"
    "| **PaaS** — _Platform as a Service_ | El proveedor ofrece una plataforma lista para desarrollar y desplegar aplicaciones sin gestionar el servidor subyacente. *Ejemplo: AWS RDS, Google App Engine, Azure SQL Database.* | La infraestructura física, el sistema operativo base, los parches del servidor y el entorno subyacente. | El código de la aplicación propia, la configuración de los accesos y la información almacenada. |\n"
    "| **SaaS** — _Software as a Service_ | El proveedor entrega una aplicación completa, lista para usar, directamente al usuario final a través del navegador. *Ejemplo: Google Workspace, Microsoft 365, Slack, Dropbox.* | Toda la infraestructura, el código del software, las bases de datos y la disponibilidad del servicio. | La gestión de usuarios, las contraseñas, la activación de MFA y los permisos sobre los archivos. |\n"
)

# Replace lines 1771-1781 (0-indexed: 1770-1780)
lines[1770:1781] = [new_table]

with open('docs/docs.md', 'w') as f:
    f.writelines(lines)

print("Done.")
with open('docs/docs.md', 'r') as f:
    updated = f.readlines()
for i, l in enumerate(updated[1770:1777], start=1771):
    print(f'{i}: {l}', end='')
