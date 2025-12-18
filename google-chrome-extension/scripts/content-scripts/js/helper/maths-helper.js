function deepCopy(gradeParts) {
  const copy = JSON.parse(JSON.stringify(gradeParts || []))  
  return copy
}
