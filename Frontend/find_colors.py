import json

with open('/Users/daniellealpimenta/.gemini/antigravity-cli/brain/9493cdbe-7cee-41e3-b7b1-88cf7d6122e9/.system_generated/logs/transcript_full.jsonl') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for call in data['tool_calls']:
                    if call['name'] == 'run_command' and 'sed' in call['args'].get('CommandLine', '') and 'pages/admin' in call['args'].get('CommandLine', ''):
                        print("==== FOUND SED COMMAND ====")
                        print(call['args'].get('CommandLine'))
                        print("===========================")
        except Exception:
            pass
