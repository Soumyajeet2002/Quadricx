export interface EncryptedEnvelope {
  version: string;
  keyId: string;
  algorithm: string;
  timestamp: number;
  nonce: string;
  encryptedKey: string;
  iv: string;
  ciphertext: string;
  authTag: string;
}

/**
 * Encrypts a plaintext payload using RSA-OAEP-256 and AES-256-GCM
 * @param payload The raw form payload (e.g. { siteId, formType, data })
 * @param keyId The ID of the public key
 * @param jwkPublicKey The public key object in JWK format
 */
export async function encryptPayload(
  payload: any,
  keyId: string,
  jwkPublicKey: JsonWebKey,
): Promise<EncryptedEnvelope> {
  const version = '1';
  const algorithm = 'RSA-OAEP-256+A256GCM';
  const timestamp = Date.now();

  const encoder = new TextEncoder();

  // 1. Generate unique random nonce (16 bytes)
  const nonceBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const nonce = arrayBufferToBase64(nonceBytes);

  // 2. Generate random 256-bit AES-GCM key
  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt'],
  );

  // 3. Export raw AES key bytes to encrypt it with RSA
  const aesRawKey = await window.crypto.subtle.exportKey('raw', aesKey);

  // 4. Import the backend's RSA public key (JWK format)
  const rsaPublicKey = await window.crypto.subtle.importKey(
    'jwk',
    jwkPublicKey,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt'],
  );

  // 5. Encrypt the raw AES key with RSA-OAEP
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    rsaPublicKey,
    aesRawKey,
  );
  const encryptedKey = arrayBufferToBase64(encryptedKeyBuffer);

  // 6. Generate random IV (12 bytes)
  const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));
  const iv = arrayBufferToBase64(ivBytes);

  // 7. Construct Additional Authenticated Data (AAD)
  // Format: version|keyId|algorithm|timestamp|nonce
  const aadString = `${version}|${keyId}|${algorithm}|${timestamp}|${nonce}`;
  const aadBuffer = encoder.encode(aadString);

  // 8. Encrypt payload data with AES-256-GCM and AAD
  const plaintextBuffer = encoder.encode(JSON.stringify(payload));
  const encryptedPayloadBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
      additionalData: aadBuffer,
      tagLength: 128, // 16-byte authentication tag
    },
    aesKey,
    plaintextBuffer,
  );

  // Web Crypto API appends the 16-byte authentication tag at the end of the ciphertext.
  // We must separate them to match the backend structure.
  const combinedBytes = new Uint8Array(encryptedPayloadBuffer);
  const ciphertextBytes = combinedBytes.slice(0, combinedBytes.byteLength - 16);
  const authTagBytes = combinedBytes.slice(combinedBytes.byteLength - 16);

  const ciphertext = arrayBufferToBase64(ciphertextBytes);
  const authTag = arrayBufferToBase64(authTagBytes);

  return {
    version,
    keyId,
    algorithm,
    timestamp,
    nonce,
    encryptedKey,
    iv,
    ciphertext,
    authTag,
  };
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = '';
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
