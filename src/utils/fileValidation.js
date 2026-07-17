const allowedDocuments = new Map([
  ['pdf', new Set(['application/pdf'])],
  ['doc', new Set(['application/msword'])],
  ['docx', new Set(['application/vnd.openxmlformats-officedocument.wordprocessingml.document'])],
]);

export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

export function validateDocument(file, { pdfOnly = false } = {}) {
  if (!(file instanceof File)) return 'Choose a document to upload.';
  if (file.size === 0) return 'The selected document is empty.';
  if (file.size > MAX_DOCUMENT_BYTES) return 'Each document must be 5 MB or smaller.';
  const hasUnsafeCharacter = [...file.name].some((character) => {
    const code = character.charCodeAt(0);
    return character === '/' || character === '\\' || code <= 31 || code === 127;
  });
  if (hasUnsafeCharacter) return 'The document filename contains unsupported characters.';

  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedTypes = allowedDocuments.get(extension);
  if (pdfOnly && extension !== 'pdf') return 'Please upload a PDF document.';
  if (!allowedTypes || (file.type && !allowedTypes.has(file.type))) {
    return 'Please upload a valid PDF, DOC, or DOCX document.';
  }

  return '';
}
