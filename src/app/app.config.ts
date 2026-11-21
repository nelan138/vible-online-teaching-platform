export default defineAppConfig({
   ui: {
      button: {
         defaultVariants: {
            color: 'neutral',
         },
         compoundVariants: [
            { leading: true, class: { label: '-translate-y-0.5' } },
            { trailing: true, class: { label: '-translate-y-0.5' } },
         ],
      },
   },
});
