import json
import re

def process_entries(input_path, output_path, max_entries=1000, skip_pages=20):
    """
    Procesa entradas.txt y genera data_muestra.json con entradas válidas.
    
    Args:
        input_path (str): Ruta a entradas.txt.
        output_path (str): Ruta a data_muestra.json.
        max_entries (int): Máximo número de entradas.
        skip_pages (int): Páginas iniciales a omitir (portada, etc.).
    """
    try:
        with open(input_path, "r", encoding="utf-8") as f:
            text = f.read()
        entries = [e.strip() for e in text.split("\n\n") if e.strip()]
        processed_entries = []
        entry_count = 0
        for entry in entries[skip_pages:]:
            lines = entry.split("\n")
            lema = lines[0].split()[0] if lines and lines[0].split() else ""
            # Filtrar lemas inválidos
            if not lema or len(lema) < 2 or not re.match(r'^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ-]+$', lema):
                continue
            definicion = " ".join(lines)
            # Limpiar definición
            definicion = re.sub(r'[^\w\sáéíóúüñÁÉÍÓÚÜÑ.,;:-]', '', definicion)
            if not definicion.strip():
                continue
            notas = []
            enlaces = []
            if "Hispam." in entry:
                notas.append("Término usado en Hispanoamérica")
            if "V." in entry:
                enlaces = re.findall(r"V\. (\w+)", entry)
            processed_entries.append({
                "lema": lema,
                "definicion": definicion,
                "gramatica": "",
                "notas": notas,
                "enlaces": enlaces[:3]
            })
            entry_count += 1
            if entry_count >= max_entries:
                break
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(processed_entries, f, ensure_ascii=False, indent=2)
        print(f"Éxito: {output_path} generado con {len(processed_entries)} entradas.")
    except Exception as e:
        print(f"Error al procesar entradas: {e}")

if __name__ == "__main__":
    process_entries("entradas.txt", "data_muestra.json")
