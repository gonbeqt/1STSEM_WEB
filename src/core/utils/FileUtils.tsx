export const validateContractFile = async (file: File): Promise<{ success: boolean; error?: string; data?: { code: string; lines: number } }> => {
    // Check if file is provided
    if (!file) {
        return {
            success: false,
            error: "No contract file provided. Please upload a Solidity file."
        };
    }

    // Validate file extension
    const validExtensions = ['.sol', '.solidity'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        return {
            success: false,
            error: `Invalid file extension '${fileExtension}'. Only ${validExtensions.join(', ')} files are allowed.`
        };
    }

    // Validate file size (max 1MB)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
        return {
            success: false,
            error: `File size (${file.size} bytes) exceeds 1MB limit (${maxSize} bytes).`
        };
    }

    // Extract and validate contract code
    try {
        const contractCode = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    resolve(event.target.result as string);
                } else {
                    reject(new Error("Failed to read file."));
                }
            };
            reader.onerror = () => {
                reject(new Error("File could not be read."));
            };
            reader.readAsText(file, 'UTF-8');
        });

        // Check for empty file
        if (!contractCode.trim()) {
            return {
                success: false,
                error: "Uploaded file is empty. Please upload a valid Solidity contract."
            };
        }

        // Basic Solidity syntax validation
        if (!contractCode.toLowerCase().includes('pragma solidity') && !contractCode.toLowerCase().includes('contract ')) {
            return {
                success: false,
                error: "File does not appear to contain valid Solidity code. Please upload a proper .sol file."
            };
        }

        return {
            success: true,
            data: {
                code: contractCode,
                lines: contractCode.split('\n').length
            }
        };

    } catch (e: any) {
        if (e.message.includes("File could not be read")) {
             return {
                success: false,
                error: "File must be UTF-8 encoded. Please ensure your Solidity file uses UTF-8 encoding."
            };
        }
        return {
            success: false,
            error: `File upload failed: ${e.message}`
        };
    }
};