import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Gemini AI'ı initialize et
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(apiKey!);

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı authentication kontrolü
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, category, summary } = body;

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Input validation
    if (!title || !category) {
      return NextResponse.json(
        { success: false, message: 'Title and category are required' },
        { status: 400 }
      );
    }

    // Gemini model'i al
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prompt oluştur
    const prompt = `
"You are a professional blog writer. Based on the information below, create a detailed, SEO-friendly blog post in Markdown format:

**Title:** ${title}
**Category:** ${category}
**Summary:** ${summary || 'No summary provided'}

Please use the following format:

1. **Introduction Paragraph:** Introduce the topic and grab the reader’s attention

2 **Main Sections:** Cover the topic in detail (2–3 main headings)

3 **Practical Examples:** Provide examples related to the topic

4 **Conclusion:** Wrap up the article with a summary paragraph

**Important Rules:**
- Write in Markdown format (use ##, ### for headings, text for bold, - for lists, \`code\` for code)
- Minimum length: 500 words
- Must be SEO-friendly
- Write in English
- Use a professional yet friendly tone
- Avoid unnecessary repetition

Only return the blog content, do not add any extra explanation.
`;

    // Gemini'dan response al
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedContent = response.text();

    return NextResponse.json({
      success: true,
      content: generatedContent,
      message: 'Content created successfully'
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
    
    console.error('Gemini AI Error Details:', {
      message: errorMessage,
      stack: errorStack,
      type: errorType,
      apiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Not Set'
    });
    
    // API key hatası kontrolü
    if (errorMessage?.includes('API_KEY_INVALID') || errorMessage?.includes('API key')) {
      return NextResponse.json(
        { success: false, message: 'Gemini API key invalid or missing' },
        { status: 500 }
      );
    }

    // Quota hatası kontrolü
    if (errorMessage?.includes('quota') || errorMessage?.includes('limit')) {
      return NextResponse.json(
        { success: false, message: 'Gemini API usage limit reached' },
        { status: 429 }
      );
    }

    // Network hatası kontrolü
    console.log("error.message ==> ", errorMessage);
    if (errorMessage?.includes('fetch') || errorMessage?.includes('network')) {
      return NextResponse.json(
        { success: false, message: 'Gemini API connection error' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while creating content',
        error: errorMessage // Debug için hata mesajını da gönder
      },
      { status: 500 }
    );
  }
}