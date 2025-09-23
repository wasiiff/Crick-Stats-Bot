import { Controller, Post, Body } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    if (!body || !body.question) {
      return { error: 'question is required' };
    }
    try {
      const response = await this.matchesService.answerQuestion(body.question);
      return response;
    } catch (err) {
      console.error(err);
      return { type: 'text', text: 'Sorry, an error occurred while processing your request.' };
    }
  }
}
