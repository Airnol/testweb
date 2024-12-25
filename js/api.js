import CONFIG from './config.js';

export async function sendMessage(messages) {
    try {
        console.log('Sending message to API...', messages);

        const response = await fetch(`${CONFIG.BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: [
                    {
                        "role": "system",
                        "content": "你是一个自闭症专业咨询助手，请简短专业地回答问题。"
                    },
                    ...messages
                ],
                temperature: 0.3,
                max_tokens: 1000,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error in sendMessage:', error);
        if (error.message.includes('timeout')) {
            return '抱歉，响应时间过长，请重试。';
        }
        return '系统暂时无法回应，请稍后再试。';
    }
} 