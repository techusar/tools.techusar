'use client';

import React from 'react';
import { ToolItem } from '@/lib/types';
import { JsonFormatterView } from './views/JsonFormatterView';
import { AITextToolView } from './views/AITextToolView';
import { ImageCompressorView } from './views/ImageCompressorView';
import { PasswordGeneratorView } from './views/PasswordGeneratorView';
import { QrCodeGeneratorView } from './views/QrCodeGeneratorView';
import { WordCounterView } from './views/WordCounterView';
import { Base64View } from './views/Base64View';
import { JwtDecoderView } from './views/JwtDecoderView';
import { HashGeneratorView } from './views/HashGeneratorView';
import { RegexTesterView } from './views/RegexTesterView';
import { InvoiceGeneratorView } from './views/InvoiceGeneratorView';
import { LoanEmiView } from './views/LoanEmiView';
import { PercentageCalculatorView } from './views/PercentageCalculatorView';
import { ProfitMarginView } from './views/ProfitMarginView';
import { CompoundInterestView } from './views/CompoundInterestView';
import { SerpPreviewView } from './views/SerpPreviewView';
import { OgMetaGeneratorView } from './views/OgMetaGeneratorView';
import { SchemaGeneratorView } from './views/SchemaGeneratorView';
import { UtmBuilderView } from './views/UtmBuilderView';
import { ColorConverterView } from './views/ColorConverterView';
import { AgeCalculatorView } from './views/AgeCalculatorView';
import { UnitConverterView } from './views/UnitConverterView';
import { CaseConverterView } from './views/CaseConverterView';
import { TextDiffView } from './views/TextDiffView';
import { LoremIpsumView } from './views/LoremIpsumView';
import { UuidGeneratorView } from './views/UuidGeneratorView';
import { UnixTimestampView } from './views/UnixTimestampView';
import { UrlEncoderView } from './views/UrlEncoderView';
import { SlugGeneratorView } from './views/SlugGeneratorView';
import { WcagContrastView } from './views/WcagContrastView';
import { CssBoxShadowView } from './views/CssBoxShadowView';
import { ImageResizerView } from './views/ImageResizerView';
import { ImageToBase64View } from './views/ImageToBase64View';
import { FaviconGeneratorView } from './views/FaviconGeneratorView';
import { MarkdownEditorView } from './views/MarkdownEditorView';
import { CsvJsonConverterView } from './views/CsvJsonConverterView';
import { HtmlEntitiesView } from './views/HtmlEntitiesView';
import { PomodoroTimerView } from './views/PomodoroTimerView';
import { TimeZoneConverterView } from './views/TimeZoneConverterView';
import { AspectRatioCalculatorView } from './views/AspectRatioCalculatorView';
import { CssGradientGeneratorView } from './views/CssGradientGeneratorView';
import { GlassmorphismView } from './views/GlassmorphismView';
import { XmlYamlFormatterView } from './views/XmlYamlFormatterView';
import { GpaGradeCalculatorView } from './views/GpaGradeCalculatorView';
import { BmiCalorieCalculatorView } from './views/BmiCalorieCalculatorView';
import { SocialPostPreviewView } from './views/SocialPostPreviewView';
import { DummyDataGeneratorView } from './views/DummyDataGeneratorView';
import { NumberBaseConverterView } from './views/NumberBaseConverterView';
import { PdfViewerToolView } from './views/PdfViewerToolView';
import { GenericToolFallbackView } from './views/GenericToolFallbackView';
import { JpgToPngView } from './views/JpgToPngView';
import { PngToJpgView } from './views/PngToJpgView';
import { ImageToWebpView } from './views/ImageToWebpView';
import { CharacterCounterView } from './views/CharacterCounterView';
import { JsonValidatorView } from './views/JsonValidatorView';
import { GstCalculatorView } from './views/GstCalculatorView';

export function ToolViewResolver({ tool }: { tool: ToolItem }) {
  const slug = tool.slug.toLowerCase();

  // 1. AI-Powered Tools
  if (
    tool.aiPowered ||
    tool.type === 'ai' ||
    slug.startsWith('ai-') ||
    tool.category === 'ai-tools'
  ) {
    return <AITextToolView tool={tool} />;
  }

  // 2. Developer & Code Formats
  if (slug === 'json-validator' || slug.includes('json-validator') || slug.includes('validate-json')) {
    return <JsonValidatorView tool={tool} />;
  }
  if (slug.includes('json-formatter') || slug === 'json-formatter') {
    return <JsonFormatterView tool={tool} />;
  }
  if (slug.includes('csv') || slug.includes('tsv')) {
    return <CsvJsonConverterView tool={tool} />;
  }
  if (slug.includes('xml') || slug.includes('yaml')) {
    return <XmlYamlFormatterView tool={tool} />;
  }
  if (slug.includes('markdown') || slug.includes('md-preview')) {
    return <MarkdownEditorView tool={tool} />;
  }
  if (slug.includes('base64') && !slug.includes('image-to-base64')) {
    return <Base64View tool={tool} />;
  }
  if (slug.includes('jwt')) {
    return <JwtDecoderView tool={tool} />;
  }
  if (slug.includes('hash') || slug.includes('md5') || slug.includes('sha256')) {
    return <HashGeneratorView tool={tool} />;
  }
  if (slug.includes('regex') && !slug.startsWith('ai-')) {
    return <RegexTesterView tool={tool} />;
  }
  if (slug.includes('uuid') || slug.includes('guid')) {
    return <UuidGeneratorView tool={tool} />;
  }
  if (slug.includes('unix') || slug.includes('timestamp') || slug.includes('epoch')) {
    return <UnixTimestampView tool={tool} />;
  }
  if (slug.includes('url-encoder') || slug.includes('uri-encoder')) {
    return <UrlEncoderView tool={tool} />;
  }
  if (slug.includes('html-entit') || slug.includes('html-encode')) {
    return <HtmlEntitiesView tool={tool} />;
  }
  if (slug.includes('binary') || slug.includes('hex-converter') || slug.includes('radix') || slug.includes('number-base')) {
    return <NumberBaseConverterView tool={tool} />;
  }
  if (slug.includes('dummy-data') || slug.includes('mock-data') || slug.includes('fake-data')) {
    return <DummyDataGeneratorView tool={tool} />;
  }

  // 3. Security & Generators
  if (slug.includes('password') || slug.includes('passphrase')) {
    return <PasswordGeneratorView tool={tool} />;
  }
  if (slug.includes('qr-code') || slug.includes('qrcode')) {
    return <QrCodeGeneratorView tool={tool} />;
  }
  if (slug.includes('slug-generator') || slug.includes('url-slug')) {
    return <SlugGeneratorView tool={tool} />;
  }
  if (slug.includes('lorem') || slug.includes('dummy-text')) {
    return <LoremIpsumView tool={tool} />;
  }

  // 4. Image & PDF Tools
  if (slug.includes('jpg-to-png') || slug.includes('jpeg-to-png')) {
    return <JpgToPngView tool={tool} />;
  }
  if (slug.includes('png-to-jpg') || slug.includes('png-to-jpeg')) {
    return <PngToJpgView tool={tool} />;
  }
  if (slug.includes('image-to-webp') || slug.includes('to-webp')) {
    return <ImageToWebpView tool={tool} />;
  }
  if (slug.includes('compressor') || slug.includes('compress-image')) {
    return <ImageCompressorView tool={tool} />;
  }
  if (slug.includes('image-resizer') || slug.includes('resize-image')) {
    return <ImageResizerView tool={tool} />;
  }
  if (slug.includes('image-to-base64')) {
    return <ImageToBase64View tool={tool} />;
  }
  if (slug.includes('favicon') || slug.includes('app-icon')) {
    return <FaviconGeneratorView tool={tool} />;
  }
  if (slug.includes('aspect-ratio')) {
    return <AspectRatioCalculatorView tool={tool} />;
  }
  if (slug.includes('pdf')) {
    return <PdfViewerToolView tool={tool} />;
  }

  // 5. CSS & Design Tools
  if (slug.includes('gradient')) {
    return <CssGradientGeneratorView tool={tool} />;
  }
  if (slug.includes('glassmorphism')) {
    return <GlassmorphismView tool={tool} />;
  }
  if (slug.includes('box-shadow') || slug.includes('shadow-generator')) {
    return <CssBoxShadowView tool={tool} />;
  }
  if (slug.includes('color-converter') || slug.includes('color-picker') || slug === 'color-converter') {
    return <ColorConverterView tool={tool} />;
  }
  if (slug.includes('contrast') || slug.includes('wcag')) {
    return <WcagContrastView tool={tool} />;
  }

  // 6. Text & Content
  if (slug === 'character-counter' || slug.includes('character-counter')) {
    return <CharacterCounterView tool={tool} />;
  }
  if (slug.includes('word-counter') || slug.includes('char-counter')) {
    return <WordCounterView tool={tool} />;
  }
  if (slug.includes('case-converter') || slug.includes('title-case')) {
    return <CaseConverterView tool={tool} />;
  }
  if (slug.includes('text-diff') || slug.includes('diff-checker')) {
    return <TextDiffView tool={tool} />;
  }
  if (slug.includes('social-post') || slug.includes('tweet-preview') || slug.includes('social-preview')) {
    return <SocialPostPreviewView tool={tool} />;
  }

  // 7. Finance & Business
  if (slug.includes('gst-calculator') || slug.includes('gst')) {
    return <GstCalculatorView tool={tool} />;
  }
  if (slug.includes('invoice') || slug.includes('receipt')) {
    return <InvoiceGeneratorView tool={tool} />;
  }
  if (slug.includes('loan') || slug.includes('emi') || slug.includes('mortgage')) {
    return <LoanEmiView tool={tool} />;
  }
  if (slug.includes('profit-margin') || slug.includes('markup')) {
    return <ProfitMarginView tool={tool} />;
  }
  if (slug.includes('compound-interest') || slug.includes('investment-growth')) {
    return <CompoundInterestView tool={tool} />;
  }

  // 8. SEO Tools
  if (slug.includes('serp') || slug.includes('google-snippet')) {
    return <SerpPreviewView tool={tool} />;
  }
  if (slug.includes('og-meta') || slug.includes('open-graph') || slug.includes('twitter-card')) {
    return <OgMetaGeneratorView tool={tool} />;
  }
  if (slug.includes('schema') || slug.includes('json-ld')) {
    return <SchemaGeneratorView tool={tool} />;
  }
  if (slug.includes('utm')) {
    return <UtmBuilderView tool={tool} />;
  }

  // 9. Everyday, Education & Time
  if (slug.includes('age-calculator') || slug.includes('birthday')) {
    return <AgeCalculatorView tool={tool} />;
  }
  if (slug.includes('unit-converter')) {
    return <UnitConverterView tool={tool} />;
  }
  if (slug.includes('percentage-calculator')) {
    return <PercentageCalculatorView tool={tool} />;
  }
  if (slug.includes('pomodoro') || slug.includes('focus-timer') || slug.includes('stopwatch')) {
    return <PomodoroTimerView tool={tool} />;
  }
  if (slug.includes('time-zone') || slug.includes('world-clock')) {
    return <TimeZoneConverterView tool={tool} />;
  }
  if (slug.includes('gpa') || slug.includes('grade-calculator')) {
    return <GpaGradeCalculatorView tool={tool} />;
  }
  if (slug.includes('bmi') || slug.includes('calorie') || slug.includes('bmr') || slug.includes('tdee')) {
    return <BmiCalorieCalculatorView tool={tool} />;
  }

  // Fallback for any other tools
  return <GenericToolFallbackView tool={tool} />;
}
