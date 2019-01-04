const path = require('path');
import { pgp } from './db';

// Helper for linking to external query files:
export function sql(filePath, file) {
    const fullPath = path.join( filePath, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

