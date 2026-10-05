'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ToolItem } from '@/lib/types';

// Lightweight unified placeholder skeleton while individual tool chunk loads
const ToolLoadingSkeleton = () => (
  <div className="w-full min-h-[340px] flex items-center justify-center p-8 bg-white dark:bg-[#111318] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading interactive tool...</span>
    </div>
  </div>
);

// Dynamic lazy imports for all 55+ tool view components to isolate client bundle size per tool
const JsonFormatterView = dynamic(() => import('./views/JsonFormatterView').then((m) => m.JsonFormatterView), { loading: ToolLoadingSkeleton });
const JsonValidatorView = dynamic(() => import('./views/JsonValidatorView').then((m) => m.JsonValidatorView), { loading: ToolLoadingSkeleton });
const AITextToolView = dynamic(() => import('./views/AITextToolView').then((m) => m.AITextToolView), { loading: ToolLoadingSkeleton });
const ImageCompressorView = dynamic(() => import('./views/ImageCompressorView').then((m) => m.ImageCompressorView), { loading: ToolLoadingSkeleton });
const PasswordGeneratorView = dynamic(() => import('./views/PasswordGeneratorView').then((m) => m.PasswordGeneratorView), { loading: ToolLoadingSkeleton });
const QrCodeGeneratorView = dynamic(() => import('./views/QrCodeGeneratorView').then((m) => m.QrCodeGeneratorView), { loading: ToolLoadingSkeleton });
const WordCounterView = dynamic(() => import('./views/WordCounterView').then((m) => m.WordCounterView), { loading: ToolLoadingSkeleton });
const Base64View = dynamic(() => import('./views/Base64View').then((m) => m.Base64View), { loading: ToolLoadingSkeleton });
const JwtDecoderView = dynamic(() => import('./views/JwtDecoderView').then((m) => m.JwtDecoderView), { loading: ToolLoadingSkeleton });
const HashGeneratorView = dynamic(() => import('./views/HashGeneratorView').then((m) => m.HashGeneratorView), { loading: ToolLoadingSkeleton });
const RegexTesterView = dynamic(() => import('./views/RegexTesterView').then((m) => m.RegexTesterView), { loading: ToolLoadingSkeleton });
const InvoiceGeneratorView = dynamic(() => import('./views/InvoiceGeneratorView').then((m) => m.InvoiceGeneratorView), { loading: ToolLoadingSkeleton });
const LoanEmiView = dynamic(() => import('./views/LoanEmiView').then((m) => m.LoanEmiView), { loading: ToolLoadingSkeleton });
const PercentageCalculatorView = dynamic(() => import('./views/PercentageCalculatorView').then((m) => m.PercentageCalculatorView), { loading: ToolLoadingSkeleton });
const ProfitMarginView = dynamic(() => import('./views/ProfitMarginView').then((m) => m.ProfitMarginView), { loading: ToolLoadingSkeleton });
const CompoundInterestView = dynamic(() => import('./views/CompoundInterestView').then((m) => m.CompoundInterestView), { loading: ToolLoadingSkeleton });
const SerpPreviewView = dynamic(() => import('./views/SerpPreviewView').then((m) => m.SerpPreviewView), { loading: ToolLoadingSkeleton });
const OgMetaGeneratorView = dynamic(() => import('./views/OgMetaGeneratorView').then((m) => m.OgMetaGeneratorView), { loading: ToolLoadingSkeleton });
const SchemaGeneratorView = dynamic(() => import('./views/SchemaGeneratorView').then((m) => m.SchemaGeneratorView), { loading: ToolLoadingSkeleton });
const UtmBuilderView = dynamic(() => import('./views/UtmBuilderView').then((m) => m.UtmBuilderView), { loading: ToolLoadingSkeleton });
const ColorConverterView = dynamic(() => import('./views/ColorConverterView').then((m) => m.ColorConverterView), { loading: ToolLoadingSkeleton });
const AgeCalculatorView = dynamic(() => import('./views/AgeCalculatorView').then((m) => m.AgeCalculatorView), { loading: ToolLoadingSkeleton });
const UnitConverterView = dynamic(() => import('./views/UnitConverterView').then((m) => m.UnitConverterView), { loading: ToolLoadingSkeleton });
const CaseConverterView = dynamic(() => import('./views/CaseConverterView').then((m) => m.CaseConverterView), { loading: ToolLoadingSkeleton });
const TextDiffView = dynamic(() => import('./views/TextDiffView').then((m) => m.TextDiffView), { loading: ToolLoadingSkeleton });
const LoremIpsumView = dynamic(() => import('./views/LoremIpsumView').then((m) => m.LoremIpsumView), { loading: ToolLoadingSkeleton });
const UuidGeneratorView = dynamic(() => import('./views/UuidGeneratorView').then((m) => m.UuidGeneratorView), { loading: ToolLoadingSkeleton });
const UnixTimestampView = dynamic(() => import('./views/UnixTimestampView').then((m) => m.UnixTimestampView), { loading: ToolLoadingSkeleton });
const UrlEncoderView = dynamic(() => import('./views/UrlEncoderView').then((m) => m.UrlEncoderView), { loading: ToolLoadingSkeleton });
const SlugGeneratorView = dynamic(() => import('./views/SlugGeneratorView').then((m) => m.SlugGeneratorView), { loading: ToolLoadingSkeleton });
const WcagContrastView = dynamic(() => import('./views/WcagContrastView').then((m) => m.WcagContrastView), { loading: ToolLoadingSkeleton });
const CssBoxShadowView = dynamic(() => import('./views/CssBoxShadowView').then((m) => m.CssBoxShadowView), { loading: ToolLoadingSkeleton });
const ImageResizerView = dynamic(() => import('./views/ImageResizerView').then((m) => m.ImageResizerView), { loading: ToolLoadingSkeleton });
const ImageToBase64View = dynamic(() => import('./views/ImageToBase64View').then((m) => m.ImageToBase64View), { loading: ToolLoadingSkeleton });
const FaviconGeneratorView = dynamic(() => import('./views/FaviconGeneratorView').then((m) => m.FaviconGeneratorView), { loading: ToolLoadingSkeleton });
const MarkdownEditorView = dynamic(() => import('./views/MarkdownEditorView').then((m) => m.MarkdownEditorView), { loading: ToolLoadingSkeleton });
const CsvJsonConverterView = dynamic(() => import('./views/CsvJsonConverterView').then((m) => m.CsvJsonConverterView), { loading: ToolLoadingSkeleton });
const HtmlEntitiesView = dynamic(() => import('./views/HtmlEntitiesView').then((m) => m.HtmlEntitiesView), { loading: ToolLoadingSkeleton });
const PomodoroTimerView = dynamic(() => import('./views/PomodoroTimerView').then((m) => m.PomodoroTimerView), { loading: ToolLoadingSkeleton });
const TimeZoneConverterView = dynamic(() => import('./views/TimeZoneConverterView').then((m) => m.TimeZoneConverterView), { loading: ToolLoadingSkeleton });
const AspectRatioCalculatorView = dynamic(() => import('./views/AspectRatioCalculatorView').then((m) => m.AspectRatioCalculatorView), { loading: ToolLoadingSkeleton });
const CssGradientGeneratorView = dynamic(() => import('./views/CssGradientGeneratorView').then((m) => m.CssGradientGeneratorView), { loading: ToolLoadingSkeleton });
const GlassmorphismView = dynamic(() => import('./views/GlassmorphismView').then((m) => m.GlassmorphismView), { loading: ToolLoadingSkeleton });
const XmlYamlFormatterView = dynamic(() => import('./views/XmlYamlFormatterView').then((m) => m.XmlYamlFormatterView), { loading: ToolLoadingSkeleton });
const GpaGradeCalculatorView = dynamic(() => import('./views/GpaGradeCalculatorView').then((m) => m.GpaGradeCalculatorView), { loading: ToolLoadingSkeleton });
const BmiCalorieCalculatorView = dynamic(() => import('./views/BmiCalorieCalculatorView').then((m) => m.BmiCalorieCalculatorView), { loading: ToolLoadingSkeleton });
const SocialPostPreviewView = dynamic(() => import('./views/SocialPostPreviewView').then((m) => m.SocialPostPreviewView), { loading: ToolLoadingSkeleton });
const DummyDataGeneratorView = dynamic(() => import('./views/DummyDataGeneratorView').then((m) => m.DummyDataGeneratorView), { loading: ToolLoadingSkeleton });
const NumberBaseConverterView = dynamic(() => import('./views/NumberBaseConverterView').then((m) => m.NumberBaseConverterView), { loading: ToolLoadingSkeleton });
const PdfViewerToolView = dynamic(() => import('./views/PdfViewerToolView').then((m) => m.PdfViewerToolView), { loading: ToolLoadingSkeleton });
const GenericToolFallbackView = dynamic(() => import('./views/GenericToolFallbackView').then((m) => m.GenericToolFallbackView), { loading: ToolLoadingSkeleton });
const JpgToPngView = dynamic(() => import('./views/JpgToPngView').then((m) => m.JpgToPngView), { loading: ToolLoadingSkeleton });
const PngToJpgView = dynamic(() => import('./views/PngToJpgView').then((m) => m.PngToJpgView), { loading: ToolLoadingSkeleton });
const ImageToWebpView = dynamic(() => import('./views/ImageToWebpView').then((m) => m.ImageToWebpView), { loading: ToolLoadingSkeleton });
const CharacterCounterView = dynamic(() => import('./views/CharacterCounterView').then((m) => m.CharacterCounterView), { loading: ToolLoadingSkeleton });
const GstCalculatorView = dynamic(() => import('./views/GstCalculatorView').then((m) => m.GstCalculatorView), { loading: ToolLoadingSkeleton });

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
