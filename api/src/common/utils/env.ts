export function env(key: string, fallback?: string){
  const value = process.env[key]
  if(!value && fallback === undefined){
    throw new Error(`Missing ${key} key in .env file`)
  }
  return value ?? fallback
}