import axios from 'axios';

export interface MetadataResponse {
    title: string;
    icon: string;
    description: string;
    label: string;
    chainId: string;
    neuron: {
      impulses: Array<{
        label: string;
        href: string;
        parameters?: Array<{
          name: string;
          label: string;
        }>;
      }>;
    };
  }
  export interface ActionPostRequest {
    account: string;
  }
  
  export interface ActionPostResponse {
    transaction: string;
    message?: string;
  }


export async function getMetadata(url: string): Promise<MetadataResponse | null> {
  try {
    const response = await axios.get<MetadataResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

export async function getTransactionSignature(url: string, account: string): Promise<ActionPostResponse | null> {
  try {
    const data: ActionPostRequest = { account };
    const response = await axios.post<ActionPostResponse>(url, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction signature:', error);
    return null;
  }
}
