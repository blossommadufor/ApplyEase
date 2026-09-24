// Robust institution comparison helper
export const isInstitutionMatch = (appUni, adminInst) => {
    if (!appUni || !adminInst) return false;
    const u = appUni.toLowerCase().trim();
    const a = adminInst.toLowerCase().trim();
    if (u === a) return true;

    const extractAcronym = (str) => {
        const match = str.match(/\(([^)]+)\)/);
        return match ? match[1].toLowerCase().trim() : "";
    };

    const uAcr = extractAcronym(u);
    const aAcr = extractAcronym(a);
    if (uAcr && aAcr && uAcr === aAcr) return true;
    if (uAcr && a.includes(uAcr)) return true;
    if (aAcr && u.includes(aAcr)) return true;

    return u.includes(a) || a.includes(u);
};