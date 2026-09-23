import dns from 'dns/promises';

export interface DnsCheckResult {
  verified: boolean;
  valueFound?: string;
  error?: string;
}

/**
 * Validates that a TXT record exists for the given domain containing the required value.
 * Used for SPF and ownership verification.
 */
export async function verifyTxtRecord(domain: string, requiredValue: string): Promise<DnsCheckResult> {
  try {
    const records = await dns.resolveTxt(domain);
    // records is an array of arrays of strings
    const flatRecords = records.map(r => r.join(''));
    
    const verified = flatRecords.includes(requiredValue);
    
    return {
      verified,
      valueFound: verified ? requiredValue : undefined,
    };
  } catch (error: any) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return { verified: false, error: 'No TXT records found' };
    }
    return { verified: false, error: error.message };
  }
}

/**
 * Validates that a CNAME record exists for the given domain pointing to the required target.
 * Used for DKIM and custom tracking domains.
 */
export async function verifyCnameRecord(domain: string, requiredTarget: string): Promise<DnsCheckResult> {
  try {
    const records = await dns.resolveCname(domain);
    const verified = records.includes(requiredTarget);
    
    return {
      verified,
      valueFound: verified ? requiredTarget : undefined,
    };
  } catch (error: any) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return { verified: false, error: 'No CNAME records found' };
    }
    return { verified: false, error: error.message };
  }
}
