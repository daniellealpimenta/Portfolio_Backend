import re

def update_crud(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Skills: add icon_url
    content = content.replace(
        "{ key: 'description', label: 'Descrição', type: 'text', req: true, vModel: 'desc' }",
        "{ key: 'description', label: 'Descrição', type: 'text', req: true, vModel: 'desc' },\n      { key: 'icon_url', label: 'Ícone URL', type: 'text', req: false, vModel: 'icon_url' }"
    )

    # Experiences: add image_url
    content = content.replace(
        "{ key: 'description', label: 'Descrição', type: 'text', req: false, vModel: 'desc' }",
        "{ key: 'description', label: 'Descrição', type: 'text', req: false, vModel: 'desc' },\n      { key: 'image_url', label: 'Imagem URL', type: 'text', req: false, vModel: 'image_url' }"
    )

    # Testimonials -> Recommendations
    content = content.replace(
        "name: 'recommendations', \n    title: 'Depoimento',\n    composableKey: 'testimonials'",
        "name: 'recommendations', \n    title: 'Recomendação',\n    composableKey: 'recommendations'"
    )
    # also add date, linkedin_url, experience_id
    content = content.replace(
        "{ key: 'description', label: 'Depoimento', type: 'text', req: true, vModel: 'quote' }",
        "{ key: 'description', label: 'Depoimento', type: 'text', req: true, vModel: 'quote' },\n      { key: 'date', label: 'Data (YYYY-MM-DD)', type: 'text', req: false, vModel: 'date' },\n      { key: 'linkedin_recommender_url', label: 'LinkedIn do Autor', type: 'text', req: false, vModel: 'linkedin_recommender_url' },\n      { key: 'experience_id', label: 'ID da Experiência vinculada', type: 'text', req: false, vModel: 'experience_id' }"
    )

    # Tools: add icon_url
    content = content.replace(
        "{ key: 'name', label: 'Nome', type: 'text', req: true, vModel: 'name' }",
        "{ key: 'name', label: 'Nome', type: 'text', req: true, vModel: 'name' },\n      { key: 'icon_url', label: 'Ícone URL', type: 'text', req: false, vModel: 'icon_url' }"
    )

    # Certificates: add description
    content = content.replace(
        "{ key: 'plataform', label: 'Emissor', type: 'text', req: true, vModel: 'issuer' }",
        "{ key: 'plataform', label: 'Emissor', type: 'text', req: true, vModel: 'issuer' },\n      { key: 'description', label: 'Descrição', type: 'text', req: false, vModel: 'description' }"
    )

    with open(filename, 'w') as f:
        f.write(content)

update_crud('generate_admin_crud.cjs')
update_crud('generate_admin_edit.cjs')
print("Generators updated!")
