import cv2  
  
def GetSimilarity_GrayHistogram(image1,image2,size = (256,256)):  
    # Image Gray Histogram Calculation:
    # https://docs.opencv.org/2.4/doc/tutorials/imgproc/histograms/histogram_calculation/histogram_calculation.html

    # Calculate gary histograms
    hist1 = GrayHistogram(cv2.imread(image1),size)
    hist2 = GrayHistogram(cv2.imread(image2),size)
    # Calculate similarity between two histograms
    sim = 0
    for i in range(len(hist1)):
        if hist1[i] != hist2[i]:
            sim = sim + (1 - abs(hist1[i]-hist2[i])/max(hist1[i],hist2[i]))
        else:
            sim = sim + 1
    sim = sim/len(hist1)
    return sim

def GrayHistogram(image,size):
    # Resize the image pixels
    rs_imgage = cv2.resize(image,size)
    # cv2.calcHist(images, channels, mask, histSize, ranges[, hist[, accumulate]])
    return cv2.calcHist([rs_imgage],[0],None,[256],[0.0,255.0])

if __name__ == '__main__':  
    img1 = 'test3.png'
    img2 = 'test2.png'
    degree = GetSimilarity_GrayHistogram(img1,img2)
    print(degree)