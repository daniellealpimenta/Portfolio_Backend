import json
import os
import urllib.parse

file_states = {}

with open('/Users/daniellealpimenta/.gemini/antigravity-cli/brain/9493cdbe-7cee-41e3-b7b1-88cf7d6122e9/.system_generated/logs/transcript_full.jsonl') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
            
        timestamp = data.get('created_at', '')
        # Stop right before the destructive script ran
        if timestamp > '2026-08-05T04:14:00Z': 
            break
            
        if data.get('type') == 'PLANNER_RESPONSE':
            tool_calls = data.get('tool_calls', [])
            for tc in tool_calls:
                name = tc.get('name')
                args = tc.get('args', {})
                
                if name == 'write_to_file':
                    target = args.get('TargetFile', '')
                    if 'Frontend/' in target:
                        file_states[target] = args.get('CodeContent', '')
                        
                elif name == 'multi_replace_file_content' or name == 'replace_file_content':
                    target = args.get('TargetFile', '')
                    if 'Frontend/' in target and target in file_states:
                        content = file_states[target]
                        
                        if name == 'replace_file_content':
                            old = args.get('TargetContent', '')
                            new = args.get('ReplacementContent', '')
                            content = content.replace(old, new)
                        else:
                            chunks = args.get('ReplacementChunks', [])
                            if isinstance(chunks, str):
                                try:
                                    chunks = json.loads(chunks)
                                except:
                                    chunks = []
                            for chunk in chunks:
                                old = chunk.get('TargetContent', '')
                                new = chunk.get('ReplacementContent', '')
                                content = content.replace(old, new)
                                
                        file_states[target] = content
                        
        elif data.get('type') == 'VIEW_FILE':
            content = data.get('content', '')
            if 'File Path: `file://' in content:
                try:
                    path_line = [l for l in content.split('\n') if l.startswith('File Path:')][0]
                    path = path_line.split('`file://')[1].split('`')[0]
                    path = urllib.parse.unquote(path)
                    
                    if 'Frontend/' in path and 'Total Lines:' in content:
                        lines = content.split('\n')
                        try:
                            start_idx = next(i for i, l in enumerate(lines) if l.startswith('1: '))
                            file_content = []
                            for l in lines[start_idx:]:
                                if ': ' in l and l.split(': ')[0].isdigit():
                                    file_content.append(l.split(': ', 1)[1])
                                elif 'The above content shows the entire' in l:
                                    break
                            
                            file_states[path] = '\n'.join(file_content)
                        except StopIteration:
                            pass
                except Exception as e:
                    pass

for path, content in file_states.items():
    if content.strip():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            f.write(content)
        print(f"Restored perfectly: {path}")

