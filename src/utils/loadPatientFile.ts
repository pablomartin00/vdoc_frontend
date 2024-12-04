// src/utils/loadPatientFile.ts
export async function loadPatientFile(selectedPatient: string): Promise<string> {
    if (selectedPatient === 'demo1-ejemplo-fisioterapia.txt') {
        try {
            const response = await fetch('/demo1-ejemplo-fisioterapia.txt');
            return response.ok ? await response.text() : 'Error al cargar el archivo de legajo.';
        } catch (error) {
            return 'Error al conectar con el servidor para cargar el archivo.';
        }
    }
    return '';
}
