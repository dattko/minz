import { Paragraph } from '@tiptap/extension-paragraph';

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
});


export default CustomParagraph;