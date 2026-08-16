from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from Models.user import User
from Models.project import Project
from Models.skill import Skill
from Models.tool import Tool
from Models.experience import Experience
from Models.certificate import Certificate
from Models.recommendation import Recommendation
from Models.project_image import ProjectImage
from Models.project_link import ProjectLink
import Models.associations
from fastapi import HTTPException

class SystemService:
    def __init__(self, db: Session):
        self.db = db

    def export_system_data(self, user_id: UUID):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
            
        projects = self.db.query(Project).filter(Project.user_id == user_id).all()
        skills = self.db.query(Skill).filter(Skill.user_id == user_id).all()
        tools = self.db.query(Tool).all()  # Tools are global in this DB
        experiences = self.db.query(Experience).filter(Experience.user_id == user_id).all()
        certificates = self.db.query(Certificate).filter(Certificate.user_id == user_id).all()
        recommendations = self.db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
        
        return {
            "projects": [
                {
                    "name": p.name,
                    "category": p.category,
                    "date": str(p.date) if p.date else None,
                    "likes": p.likes,
                    "description": p.description,
                    "links": [
                        {"name": l.name, "url": l.url, "icon": l.icon} for l in p.links
                    ]
                } for p in projects
            ],
            "skills": [
                {
                    "name": s.name,
                    "description": s.description
                } for s in skills
            ],
            "tools": [{"name": t.name, "icon_url": t.icon_url} for t in tools],
            "experiences": [
                {
                    "id": str(e.id),
                    "position": e.position,
                    "company": e.company,
                    "description": e.description,
                    "start_date": str(e.start_date) if e.start_date else None,
                    "exit_date": str(e.exit_date) if e.exit_date else None,
                    "image_url": e.image_url
                } for e in experiences
            ],
            "certificates": [
                {
                    "name_course": c.name_course,
                    "plataform": c.plataform,
                    "workload": c.workload,
                    "issue_date": str(c.issue_date) if c.issue_date else None,
                    "digital_certificate_url": c.digital_certificate_url,
                    "description": c.description
                } for c in certificates
            ],
            "recommendations": [
                {
                    "name_recommender": r.name_recommender,
                    "description": r.description,
                    "linkedin_recommender_url": r.linkedin_recommender_url,
                    "recommender_avatar_url": r.recommender_avatar_url,
                    "date": str(r.date) if r.date else None,
                    "experience_id": str(r.experience_id) if r.experience_id else None
                } for r in recommendations
            ]
        }

    def import_system_data(self, user_id: UUID, data: dict):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        try:
            # Projetos
            if 'projects' in data:
                self.db.query(Project).filter(Project.user_id == user_id).delete()
                for p in data['projects']:
                    cat_val = p.get('category') or p.get('cat', 'FrontEnd')
                    # Normalize category string to match Enum
                    cat_val_lower = cat_val.lower()
                    if 'mobile' in cat_val_lower:
                        valid_cat = 'Mobile'
                    elif 'front' in cat_val_lower:
                        valid_cat = 'FrontEnd'
                    elif 'back' in cat_val_lower:
                        valid_cat = 'BackEnd'
                    elif 'full' in cat_val_lower:
                        valid_cat = 'FullStack'
                    elif 'data' in cat_val_lower:
                        valid_cat = 'DataScience'
                    elif 'game' in cat_val_lower:
                        valid_cat = 'GameDev'
                    else:
                        valid_cat = 'Other'
                        
                    new_p = Project(
                        user_id=user_id,
                        name=p.get('name') or p.get('title', ''),
                        category=valid_cat,
                        date=date.fromisoformat(p.get('date')) if p.get('date') else date.today(),
                        likes=p.get('likes', 0),
                        description=p.get('description')
                    )
                    self.db.add(new_p)
                    self.db.flush()

                    for l in p.get('links', []):
                        if l.get('name') and l.get('url') and l.get('icon'):
                            self.db.add(ProjectLink(
                                project_id=new_p.id,
                                name=l['name'],
                                url=l['url'],
                                icon=l['icon']
                            ))
            
            # Habilidades
            if 'skills' in data:
                self.db.query(Skill).filter(Skill.user_id == user_id).delete()
                for s in data['skills']:
                    new_s = Skill(
                        user_id=user_id,
                        name=s.get('name', ''),
                        description=s.get('description') or s.get('desc', '')
                    )
                    self.db.add(new_s)
                    
            # Ferramentas (Tools are global, just add if not exists)
            if 'tools' in data:
                existing_tools = {t.name for t in self.db.query(Tool).all()}
                for t in data['tools']:
                    t_name = t.get('name', '')
                    if t_name and t_name not in existing_tools:
                        new_t = Tool(name=t_name, icon_url=t.get('icon_url'))
                        self.db.add(new_t)
                        existing_tools.add(t_name)
                    
            # Experiências
            exp_mapping = {}
            if 'experiences' in data:
                self.db.query(Recommendation).filter(Recommendation.user_id == user_id).delete()
                self.db.query(Experience).filter(Experience.user_id == user_id).delete()
                self.db.flush()
                
                for e in data['experiences']:
                    st_date_str = e.get('start_date') or f"{e.get('year', '2024')}-01-01"
                    ex_date_str = e.get('exit_date')
                    new_e = Experience(
                        user_id=user_id,
                        position=e.get('position') or e.get('title', 'Desenvolvedor'),
                        company=e.get('company', 'Empresa Oculta'),
                        description=e.get('description') or e.get('desc', ''),
                        start_date=date.fromisoformat(st_date_str),
                        exit_date=date.fromisoformat(ex_date_str) if ex_date_str else None,
                        image_url=e.get('image_url')
                    )
                    self.db.add(new_e)
                    self.db.flush()
                    if 'id' in e:
                        exp_mapping[e['id']] = new_e.id

            # Certificados
            if 'certificates' in data:
                self.db.query(Certificate).filter(Certificate.user_id == user_id).delete()
                for i, c in enumerate(data['certificates']):
                    new_c = Certificate(
                        user_id=user_id,
                        name_course=c.get('name_course') or c.get('title', ''),
                        plataform=c.get('plataform') or c.get('issuer', 'N/A'),
                        workload=c.get('workload', 0),
                        issue_date=date.fromisoformat(c.get('issue_date')) if c.get('issue_date') else date.today(),
                        digital_certificate_url=c.get('digital_certificate_url') or c.get('url') or f"http://cert.fake/{i}",
                        description=c.get('description')
                    )
                    self.db.add(new_c)

            # Depoimentos (Recommendations)
            if 'recommendations' in data:
                if 'experiences' not in data:
                     self.db.query(Recommendation).filter(Recommendation.user_id == user_id).delete()
                
                first_exp = self.db.query(Experience).filter(Experience.user_id == user_id).first()
                for r in data['recommendations']:
                    mapped_exp_id = exp_mapping.get(r.get('experience_id'))
                    if not mapped_exp_id and first_exp:
                        mapped_exp_id = first_exp.id
                        
                    if mapped_exp_id:
                        new_r = Recommendation(
                            user_id=user_id,
                            experience_id=mapped_exp_id,
                            name_recommender=r.get('name_recommender') or r.get('name', ''),
                            description=r.get('description') or r.get('quote', ''),
                            linkedin_recommender_url=r.get('linkedin_recommender_url'),
                            recommender_avatar_url=r.get('recommender_avatar_url'),
                            date=date.fromisoformat(r.get('date')) if r.get('date') else date.today()
                        )
                        self.db.add(new_r)
            
            self.db.commit()
            return {"detail": "Sistema atualizado com sucesso"}
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Erro ao processar JSON: {str(e)}")
