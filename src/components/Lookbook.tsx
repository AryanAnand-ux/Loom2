import { db } from "../lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/errorUtils";
import { Trash2, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ClosetItem, Outfit } from "../types";
import { useCloset } from "../hooks/useCloset";
import { useOutfits } from "../hooks/useOutfits";

export default function Lookbook({ userId }: { userId: string }) {
  const { items } = useCloset(userId);
  const { outfits, loading } = useOutfits(userId);

  const deleteOutfit = async (id: string) => {
    if (!confirm("Remove this outfit from your lookbook?")) return;
    const path = `users/${userId}/outfits/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const getOutfitItems = (outfit: Outfit) => ({
    top: items.find(i => i.id === outfit.topId),
    bottom: items.find(i => i.id === outfit.bottomId),
    footwear: items.find(i => i.id === outfit.footwearId),
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-white rounded-3xl animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      <header className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-serif italic text-gray-900">Lookbook</h2>
        <p className="text-gray-500 text-sm">{outfits.length} curated looks saved</p>
      </header>

      {outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center text-gray-400 py-24">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
            <Bookmark size={32} />
          </div>
          <p className="font-serif italic text-lg text-gray-500">Your lookbook is waiting.</p>
          <p className="text-xs font-sans tracking-wide max-w-xs">Use the Stylist AI to curate and save your favorite outfits.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {outfits.map((outfit) => {
              const { top, bottom, footwear } = getOutfitItems(outfit);
              return (
                <motion.div
                  key={outfit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white p-5 md:p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col"
                >
                  {/* Outfit images */}
                  <div className="flex -space-x-6 sm:-space-x-8 mb-5">
                    <OutfitComponent item={top} index={0} />
                    <OutfitComponent item={bottom} index={1} />
                    <OutfitComponent item={footwear} index={2} />
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 font-sans">{outfit.scene}</p>
                      <p className="text-sm font-serif italic text-gray-900 leading-relaxed">"{outfit.stylistNote}"</p>
                    </div>
                  </div>

                  {/* Delete — always visible on mobile, hover on desktop */}
                  <div className="absolute top-5 right-5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteOutfit(outfit.id)}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-red-500 shadow-lg border border-gray-100"
                      title="Remove from Lookbook"
                      aria-label="Remove from Lookbook"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function OutfitComponent({ item, index }: { item?: ClosetItem; index: number }) {
  return (
    <div
      className="relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 rounded-2xl overflow-hidden border-4 border-white bg-gray-50 shadow-md shrink-0 transition-transform duration-300 group-hover:-translate-y-2 hover:z-10"
      style={{ zIndex: 10 - index }}
    >
      {item ? (
        <img src={item.imageUrl} alt={item.category} loading="lazy" decoding="async" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 uppercase tracking-widest font-bold text-center px-1">
          Missing
        </div>
      )}
    </div>
  );
}
