import os
import smtplib
from email.message import EmailMessage

# SMTP Configurações (Preencher via .env na vida real)
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER', '')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')

def send_contact_email_task(name: str, email: str, subject: str, message_body: str, target_email: str):
    """
    Função executada via BackgroundTasks no FastAPI.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        # Modo de simulação se as credenciais não estiverem configuradas
        print("="*40)
        print(" 📨 SIMULANDO ENVIO DE E-MAIL (SMTP NÃO CONFIGURADO)")
        print(f"Para: {target_email}")
        print(f"Assunto: {subject} - Contato de {name}")
        print(f"Corpo:\nNome: {name}\nEmail de Retorno: {email}\n\nMensagem:\n{message_body}")
        print("="*40)
        return
        
    try:
        msg = EmailMessage()
        msg['Subject'] = f"{subject} - Contato de {name}"
        msg['From'] = SMTP_USER
        msg['To'] = target_email
        msg['Reply-To'] = email
        
        content = f"Novo contato recebido do Portfólio:\n\nNome: {name}\nEmail de Retorno: {email}\n\nMensagem:\n{message_body}"
        msg.set_content(content)
        
        # Conexão e envio
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            
        print("✓ Email enviado com sucesso via BackgroundTask.")
    except Exception as e:
        print(f"❌ Erro ao enviar email na BackgroundTask: {e}")
