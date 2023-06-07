import { v4 as uuidv4 } from 'uuid';

export const NEXT_PUBLIC_DEFAULT_MODEL='gpt-3.5-turbo'
export const NEXT_PUBLIC_DEFAULT_TEMPERATURE='0.1'
export const NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT="You are Book Genius, an AI coach for discovering, interpreting and making books actionable. You can also act as the author of a particular book. You want to be 100% accurate in all your knoweldge about books."

export const standardFolders = 
    [
        {
            id: 1,
            name: '1 Discover',
            type: "prompt",
            system: true,
        },
        {
            id: 2,
            name: '2 Inspect',
            type: "prompt",
            system: true,
        },
        {
            id: 3,
            name: '3 Action',
            type: "prompt",
            system: true,
        },
    ];


export const standardPrompts = 
[
        {
            id: uuidv4(),
            name: 'test',
            description: "test",
            content: 'test',
            model: {
                id: "gpt-3.5-turbo",
                name: "GPT-3.5",
                maxLength: 12000,
                tokenLimit: 4000
              },
            folderId: 1,
            system: true,
        },
    ];