import html2canvas from 'html2canvas';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Recipe } from '@/types/recipe';

export const generateRecipeImage = async (
  recipe: Recipe,
  userNotes?: string
): Promise<void> => {
  // Create a hidden container for the recipe card
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.width = '1080px'; // Instagram-friendly size
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '60px';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  // Build the recipe card HTML
  container.innerHTML = `
    <div style="background: linear-gradient(135deg, #047857 0%, #065f46 100%); padding: 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
      <!-- Header -->
      <div style="background: white; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
        <div style="font-size: 48px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; line-height: 1.2;">
          ${recipe.name}
        </div>
        <div style="font-size: 24px; color: #666; margin-bottom: 20px;">
          ${recipe.description || ''}
        </div>
        <div style="display: flex; gap: 20px; flex-wrap: wrap; font-size: 20px; color: #888;">
          <span>👥 ${recipe.servings} servings</span>
          <span>⏱️ ${recipe.prepTime}</span>
          <span>🔥 ${recipe.cookTime}</span>
          <span>📊 ${recipe.difficulty}</span>
        </div>
      </div>

      <!-- Ingredients -->
      <div style="background: white; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
        <div style="font-size: 36px; font-weight: 700; color: #047857; margin-bottom: 20px;">
          🥗 Ingredients
        </div>
        <div style="font-size: 20px; line-height: 2; color: #333;">
          ${recipe.ingredients?.map(ing => {
            const parts = [ing.amount, ing.unit, ing.item].filter(Boolean).map(p => p.toString().trim());
            return `<div style="margin-bottom: 8px;">• ${parts.join(' ')}</div>`;
          }).join('') || 'No ingredients available'}
        </div>
      </div>

      <!-- Instructions -->
      <div style="background: white; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
        <div style="font-size: 36px; font-weight: 700; color: #047857; margin-bottom: 20px;">
          👨‍🍳 Instructions
        </div>
        <div style="font-size: 20px; line-height: 1.8; color: #333;">
          ${recipe.instructions.map((instruction, idx) => 
            `<div style="margin-bottom: 16px; padding-left: 40px; position: relative;">
              <span style="position: absolute; left: 0; font-weight: 700; color: #047857;">${idx + 1}.</span>
              ${instruction.replace(/\[|\]/g, '')}
            </div>`
          ).join('')}
        </div>
      </div>

      ${userNotes ? `
      <!-- Personal Notes -->
      <div style="background: rgba(255,255,255,0.95); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 3px dashed #047857;">
        <div style="font-size: 36px; font-weight: 700; color: #047857; margin-bottom: 20px;">
          📝 Your Notes
        </div>
        <div style="font-size: 20px; line-height: 1.8; color: #555; font-style: italic;">
          ${userNotes}
        </div>
      </div>
      ` : ''}

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px;">
        <div style="background: white; display: inline-block; padding: 20px 40px; border-radius: 12px;">
          <div style="font-size: 32px; font-weight: 800; color: #047857;">QuickDish</div>
          <div style="font-size: 18px; color: #888; margin-top: 5px;">${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);

  try {
    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // High quality
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
    });

    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
    });
    reader.readAsDataURL(blob);
    const base64Data = await base64Promise;

    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      // Save to device using Capacitor
      const fileName = `QuickDish-${sanitizeFilename(recipe.name)}-${Date.now()}.png`;
      
      // Write file
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      // Share using native share sheet (which has "Save to Photos" option)
      await Share.share({
        title: `${recipe.name} - QuickDish Recipe`,
        text: `Check out this recipe: ${recipe.name}`,
        url: savedFile.uri,
        dialogTitle: 'Save Recipe Image',
      });

    } else {
      // Web: Download the image
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QuickDish-${sanitizeFilename(recipe.name)}.png`;
      link.href = url;
      link.click();
    }

  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

// Helper function to sanitize filename
const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};


